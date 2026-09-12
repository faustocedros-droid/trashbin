from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Dict, List, Optional

import cv2
import numpy as np


@dataclass
class VideoAnalysisResult:
    speeds: np.ndarray
    steering: np.ndarray
    centers: np.ndarray
    duration_seconds: float


def _safe_percentile(values: np.ndarray, pct: float, fallback: float) -> float:
    if values.size == 0:
        return fallback
    return float(np.percentile(values, pct))


def _normalize_speed(raw_speeds: np.ndarray) -> np.ndarray:
    if raw_speeds.size == 0:
        return raw_speeds

    low = _safe_percentile(raw_speeds, 5, 0.0)
    high = _safe_percentile(raw_speeds, 95, 1.0)
    if high - low < 1e-6:
        return np.full_like(raw_speeds, 140.0)

    normalized = (raw_speeds - low) / (high - low)
    normalized = np.clip(normalized, 0.0, 1.0)
    return 80.0 + normalized * 200.0


def analyze_video(video_path: str, sample_rate_hz: float = 6.0) -> VideoAnalysisResult:
    capture = cv2.VideoCapture(video_path)
    if not capture.isOpened():
        raise ValueError(f"Impossibile aprire il video: {os.path.basename(video_path)}")

    fps = capture.get(cv2.CAP_PROP_FPS) or 30.0
    total_frames = int(capture.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    duration_seconds = (total_frames / fps) if fps > 0 else 0.0
    frame_step = max(1, int(round(fps / max(sample_rate_hz, 1))))

    ok, frame = capture.read()
    if not ok or frame is None:
        capture.release()
        raise ValueError(f"Il video {os.path.basename(video_path)} non contiene frame leggibili")

    prev_gray = cv2.cvtColor(cv2.resize(frame, (320, 180)), cv2.COLOR_BGR2GRAY)
    prev_edges = cv2.Canny(prev_gray, 70, 140)
    _, x_coords = np.nonzero(prev_edges)
    prev_center_x = float(np.mean(x_coords)) if x_coords.size else prev_gray.shape[1] / 2

    raw_speeds: List[float] = [0.0]
    steering_values: List[float] = [0.0]
    center_positions: List[float] = [prev_center_x / prev_gray.shape[1]]

    frame_idx = 1
    while True:
        ok, frame = capture.read()
        if not ok or frame is None:
            break

        if frame_idx % frame_step != 0:
            frame_idx += 1
            continue

        gray = cv2.cvtColor(cv2.resize(frame, (320, 180)), cv2.COLOR_BGR2GRAY)
        diff = cv2.absdiff(gray, prev_gray)
        motion_intensity = float(np.mean(diff))

        edges = cv2.Canny(gray, 70, 140)
        _, x_coords = np.nonzero(edges)
        center_x = float(np.mean(x_coords)) if x_coords.size else prev_center_x

        steering = abs(center_x - prev_center_x) / gray.shape[1] * 100.0

        raw_speeds.append(motion_intensity)
        steering_values.append(steering)
        center_positions.append(center_x / gray.shape[1])

        prev_gray = gray
        prev_center_x = center_x
        frame_idx += 1

    capture.release()

    speeds = _normalize_speed(np.array(raw_speeds, dtype=np.float32))
    steering = np.array(steering_values, dtype=np.float32)
    centers = np.array(center_positions, dtype=np.float32)

    return VideoAnalysisResult(
        speeds=speeds,
        steering=steering,
        centers=centers,
        duration_seconds=duration_seconds,
    )


def _segment_bounds(length: int, segments: int) -> List[tuple[int, int]]:
    usable_segments = max(1, min(segments, length))
    bounds: List[tuple[int, int]] = []
    for i in range(usable_segments):
        start = int(round(i * length / usable_segments))
        end = int(round((i + 1) * length / usable_segments))
        if end <= start:
            end = min(length, start + 1)
        bounds.append((start, end))
    return bounds


def _segment_metrics(result: VideoAnalysisResult, start: int, end: int) -> Dict[str, float]:
    speeds = result.speeds[start:end]
    steering = result.steering[start:end]
    centers = result.centers[start:end]

    if speeds.size == 0:
        return {
            "braking_speed": 0.0,
            "braking_point_pct": 0.0,
            "braking_modulation": 0.0,
            "turn_in_steering": 0.0,
            "exit_steering": 0.0,
            "corrections": 0.0,
            "trajectory_consistency": 0.0,
            "min_corner_speed": 0.0,
            "throttle_open_pct": 0.0,
            "full_throttle_pct": 0.0,
        }

    deltas = np.diff(speeds) if speeds.size > 1 else np.array([0.0])
    braking_idx = int(np.argmin(deltas)) if deltas.size else 0
    braking_speed = float(speeds[min(braking_idx, speeds.size - 1)])

    negative_deltas = deltas[deltas < 0]
    braking_modulation = float(np.std(negative_deltas) / 2.5) if negative_deltas.size else 0.0
    braking_modulation = float(np.clip(braking_modulation, 0.0, 10.0))

    one_third = max(1, speeds.size // 3)
    turn_in_steering = float(np.mean(steering[:one_third]))
    exit_steering = float(np.mean(steering[-one_third:]))

    center_deltas = np.diff(centers) if centers.size > 1 else np.array([0.0])
    sign_changes = np.sum(np.diff(np.sign(center_deltas)) != 0) if center_deltas.size > 1 else 0
    corrections = float(min(10.0, sign_changes * 1.8))

    trajectory_consistency = float(np.clip(100.0 - np.std(centers) * 260.0, 35.0, 100.0))

    min_corner_speed = float(np.min(speeds))
    min_idx = int(np.argmin(speeds))

    post_min = speeds[min_idx:]
    if post_min.size <= 1:
        throttle_open_pct = 100.0
        full_throttle_pct = 100.0
    else:
        post_deltas = np.diff(post_min)
        throttle_candidates = np.where(post_deltas > 1.3)[0]
        throttle_idx = int(throttle_candidates[0] + min_idx + 1) if throttle_candidates.size else speeds.size - 1
        full_threshold = float(np.percentile(speeds, 92))
        full_candidates = np.where(speeds[throttle_idx:] >= full_threshold)[0]
        full_idx = int(full_candidates[0] + throttle_idx) if full_candidates.size else speeds.size - 1

        throttle_open_pct = float((throttle_idx / max(1, speeds.size - 1)) * 100.0)
        full_throttle_pct = float((full_idx / max(1, speeds.size - 1)) * 100.0)

    braking_point_pct = float((braking_idx / max(1, speeds.size - 1)) * 100.0)

    return {
        "braking_speed": braking_speed,
        "braking_point_pct": braking_point_pct,
        "braking_modulation": braking_modulation,
        "turn_in_steering": turn_in_steering,
        "exit_steering": exit_steering,
        "corrections": corrections,
        "trajectory_consistency": trajectory_consistency,
        "min_corner_speed": min_corner_speed,
        "throttle_open_pct": throttle_open_pct,
        "full_throttle_pct": full_throttle_pct,
    }


def _steering_style(value: float) -> str:
    if value < 2.0:
        return "input morbido"
    if value < 4.5:
        return "input progressivo"
    if value < 7.0:
        return "input deciso"
    return "input aggressivo"


def _balance_label(value: float) -> str:
    if value < 2.5:
        return "assetto neutro, poche correzioni"
    if value < 5.5:
        return "micro-correzioni presenti"
    if value < 8.0:
        return "instabilità in appoggio"
    return "correzioni marcate (possibile sotto/sovrasterzo)"


def _trajectory_label(value: float) -> str:
    if value >= 85:
        return "linea molto pulita"
    if value >= 70:
        return "linea abbastanza costante"
    if value >= 55:
        return "linea variabile"
    return "linea irregolare"


def _build_segment_point(label: str, a: Dict[str, float], b: Dict[str, float]) -> Dict[str, object]:
    return {
        "point_name": label,
        "video_a": {
            "braking_speed_kmh": round(a["braking_speed"], 1),
            "braking_point_pct": round(a["braking_point_pct"], 1),
            "braking_modulation_score": round(a["braking_modulation"], 1),
            "turn_in_steering": _steering_style(a["turn_in_steering"]),
            "exit_steering": _steering_style(a["exit_steering"]),
            "balance_corrections": _balance_label(a["corrections"]),
            "trajectory": _trajectory_label(a["trajectory_consistency"]),
            "min_corner_speed_kmh": round(a["min_corner_speed"], 1),
            "throttle_open_pct": round(a["throttle_open_pct"], 1),
            "full_throttle_pct": round(a["full_throttle_pct"], 1),
        },
        "video_b": {
            "braking_speed_kmh": round(b["braking_speed"], 1),
            "braking_point_pct": round(b["braking_point_pct"], 1),
            "braking_modulation_score": round(b["braking_modulation"], 1),
            "turn_in_steering": _steering_style(b["turn_in_steering"]),
            "exit_steering": _steering_style(b["exit_steering"]),
            "balance_corrections": _balance_label(b["corrections"]),
            "trajectory": _trajectory_label(b["trajectory_consistency"]),
            "min_corner_speed_kmh": round(b["min_corner_speed"], 1),
            "throttle_open_pct": round(b["throttle_open_pct"], 1),
            "full_throttle_pct": round(b["full_throttle_pct"], 1),
        },
    }


def _build_report(
    session_name: str,
    track_name: str,
    driver_a: str,
    driver_b: str,
    points: List[Dict[str, object]],
) -> str:
    lines = [
        f"REPORT COMPARATIVO ONBOARD AUTOMATICO - {session_name}",
        f"Circuito: {track_name or 'Non specificato'}",
        f"Confronto: {driver_a} vs {driver_b}",
        "Metodo: analisi automatica frame-by-frame (campionata)",
        "",
        "Sintesi ingegnere di pista",
    ]

    braking_a = np.mean([p["video_a"]["braking_speed_kmh"] for p in points]) if points else 0
    braking_b = np.mean([p["video_b"]["braking_speed_kmh"] for p in points]) if points else 0
    min_a = np.mean([p["video_a"]["min_corner_speed_kmh"] for p in points]) if points else 0
    min_b = np.mean([p["video_b"]["min_corner_speed_kmh"] for p in points]) if points else 0
    corrections_a = np.mean([p["video_a"]["braking_modulation_score"] for p in points]) if points else 0
    corrections_b = np.mean([p["video_b"]["braking_modulation_score"] for p in points]) if points else 0
    throttle_gap_a = np.mean(
        [p["video_a"]["full_throttle_pct"] - p["video_a"]["throttle_open_pct"] for p in points]
    ) if points else 0
    throttle_gap_b = np.mean(
        [p["video_b"]["full_throttle_pct"] - p["video_b"]["throttle_open_pct"] for p in points]
    ) if points else 0

    if abs(braking_a - braking_b) < 0.6:
        lines.append("- Velocità alla staccata media: profili equivalenti.")
    else:
        leader = driver_a if braking_a > braking_b else driver_b
        lines.append(f"- Velocità alla staccata media: vantaggio {leader} di {abs(braking_a - braking_b):.1f} km/h.")

    if abs(min_a - min_b) < 0.6:
        lines.append("- Velocità minima in curva: valori molto allineati.")
    else:
        leader = driver_a if min_a > min_b else driver_b
        lines.append(f"- Velocità minima in curva: vantaggio {leader} di {abs(min_a - min_b):.1f} km/h.")

    lines.append("")
    lines.append("Analisi per segmento")

    for idx, point in enumerate(points, start=1):
        a = point["video_a"]
        b = point["video_b"]
        lines.extend(
            [
                "",
                f"{idx}) {point['point_name']}",
                f"- Velocità staccata: {driver_a} {a['braking_speed_kmh']} km/h | {driver_b} {b['braking_speed_kmh']} km/h",
                f"- Punto staccata: {driver_a} {a['braking_point_pct']}% segmento | {driver_b} {b['braking_point_pct']}%",
                f"- Modulazione staccata (0-10): {driver_a} {a['braking_modulation_score']} | {driver_b} {b['braking_modulation_score']}",
                f"- Inserimento/sterzo ingresso: {driver_a} {a['turn_in_steering']} | {driver_b} {b['turn_in_steering']}",
                f"- Sterzo uscita: {driver_a} {a['exit_steering']} | {driver_b} {b['exit_steering']}",
                f"- Correzioni bilanciamento: {driver_a} {a['balance_corrections']} | {driver_b} {b['balance_corrections']}",
                f"- Traiettoria: {driver_a} {a['trajectory']} | {driver_b} {b['trajectory']}",
                f"- Velocità minima curva: {driver_a} {a['min_corner_speed_kmh']} km/h | {driver_b} {b['min_corner_speed_kmh']} km/h",
                f"- Apertura gas: {driver_a} {a['throttle_open_pct']}% | {driver_b} {b['throttle_open_pct']}%",
                f"- Full gas: {driver_a} {a['full_throttle_pct']}% | {driver_b} {b['full_throttle_pct']}%",
            ]
        )

    lines.extend(
        [
            "",
            "Coaching finale",
            f"- {driver_a if corrections_a >= corrections_b else driver_b}: ridurre la variabilità in staccata e limitare correzioni superflue in inserimento.",
            f"- {driver_a if throttle_gap_a >= throttle_gap_b else driver_b}: lavorare sulla transizione apertura gas → full gas per anticipare l'accelerazione in uscita.",
            "- Ripetere l'analisi dopo run dedicato per validare il trend del delta prestazionale.",
        ]
    )

    return "\n".join(lines)


def analyze_onboard_pair(
    video_a_path: str,
    video_b_path: str,
    session_name: str,
    track_name: str,
    driver_a_name: str,
    driver_b_name: str,
    track_map_name: Optional[str] = None,
) -> Dict[str, object]:
    result_a = analyze_video(video_a_path)
    result_b = analyze_video(video_b_path)

    analysis_length = int(min(result_a.speeds.size, result_b.speeds.size))
    if analysis_length < 12:
        raise ValueError("I video sono troppo corti per una comparazione automatica affidabile")

    result_a.speeds = result_a.speeds[:analysis_length]
    result_a.steering = result_a.steering[:analysis_length]
    result_a.centers = result_a.centers[:analysis_length]

    result_b.speeds = result_b.speeds[:analysis_length]
    result_b.steering = result_b.steering[:analysis_length]
    result_b.centers = result_b.centers[:analysis_length]

    segment_count = max(6, min(12, analysis_length // 25 if analysis_length >= 25 else 6))
    bounds = _segment_bounds(analysis_length, segment_count)

    points: List[Dict[str, object]] = []
    for idx, (start, end) in enumerate(bounds, start=1):
        a_metrics = _segment_metrics(result_a, start, end)
        b_metrics = _segment_metrics(result_b, start, end)

        start_pct = int(round((start / analysis_length) * 100))
        end_pct = int(round((end / analysis_length) * 100))
        label = f"Segmento {idx} ({start_pct}% - {end_pct}%)"
        points.append(_build_segment_point(label, a_metrics, b_metrics))

    report = _build_report(session_name, track_name, driver_a_name, driver_b_name, points)

    return {
        "session_name": session_name,
        "track_name": track_name,
        "driver_a_name": driver_a_name,
        "driver_b_name": driver_b_name,
        "track_map_provided": bool(track_map_name),
        "track_map_name": track_map_name,
        "analysis_mode": "automatic_frame_sampling",
        "sample_count": analysis_length,
        "segments": points,
        "report": report,
    }
