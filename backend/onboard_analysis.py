from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple

import cv2
import numpy as np


@dataclass
class VideoAnalysisResult:
    speeds: np.ndarray
    steering: np.ndarray
    centers: np.ndarray
    map_points: np.ndarray
    duration_seconds: float


@dataclass
class CurveSegment:
    name: str
    corner_index: int
    start: int
    end: int


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


def _moving_average(values: np.ndarray, window: int = 5) -> np.ndarray:
    if values.size == 0 or window <= 1:
        return values

    pad = window // 2
    padded = np.pad(values, ((pad, pad), (0, 0)), mode="edge")
    output = np.zeros_like(values)
    for i in range(values.shape[0]):
        output[i] = np.mean(padded[i:i + window], axis=0)
    return output


def _detect_red_dot_position(frame: np.ndarray, last_point: Optional[np.ndarray]) -> Optional[np.ndarray]:
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    lower_red_1 = np.array([0, 90, 80], dtype=np.uint8)
    upper_red_1 = np.array([10, 255, 255], dtype=np.uint8)
    lower_red_2 = np.array([160, 90, 80], dtype=np.uint8)
    upper_red_2 = np.array([179, 255, 255], dtype=np.uint8)

    mask = cv2.inRange(hsv, lower_red_1, upper_red_1) | cv2.inRange(hsv, lower_red_2, upper_red_2)
    mask = cv2.GaussianBlur(mask, (3, 3), 0)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    candidates: List[Tuple[np.ndarray, float]] = []

    for contour in contours:
        area = cv2.contourArea(contour)
        if area < 2 or area > 220:
            continue

        moments = cv2.moments(contour)
        if moments["m00"] == 0:
            continue

        center_x = moments["m10"] / moments["m00"]
        center_y = moments["m01"] / moments["m00"]
        perimeter = cv2.arcLength(contour, True)
        circularity = 0.0
        if perimeter > 0:
            circularity = (4 * np.pi * area) / (perimeter ** 2)

        score = circularity * 2.0 - abs(area - 25) / 25.0
        candidates.append((np.array([center_x, center_y], dtype=np.float32), score))

    if not candidates:
        return None

    if last_point is None:
        return max(candidates, key=lambda c: c[1])[0]

    def _score(candidate: Tuple[np.ndarray, float]) -> float:
        point, base_score = candidate
        distance_penalty = np.linalg.norm(point - last_point) / 120.0
        return base_score - distance_penalty

    return max(candidates, key=_score)[0]


def _normalize_map_points(raw_points: np.ndarray) -> np.ndarray:
    x_values = raw_points[:, 0]
    y_values = raw_points[:, 1]

    x_min, x_max = float(np.min(x_values)), float(np.max(x_values))
    y_min, y_max = float(np.min(y_values)), float(np.max(y_values))

    x_range = max(1.0, x_max - x_min)
    y_range = max(1.0, y_max - y_min)

    normalized_x = (x_values - x_min) / x_range
    normalized_y = (y_values - y_min) / y_range

    return np.column_stack([normalized_x, normalized_y]).astype(np.float32)


def analyze_video(video_path: str, sample_rate_hz: float = 8.0) -> VideoAnalysisResult:
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

    resized = cv2.resize(frame, (640, 360))
    prev_gray = cv2.cvtColor(cv2.resize(frame, (320, 180)), cv2.COLOR_BGR2GRAY)

    detected = _detect_red_dot_position(resized, None)
    if detected is None:
        detected = np.array([resized.shape[1] / 2, resized.shape[0] / 2], dtype=np.float32)

    raw_speeds: List[float] = [0.0]
    steering_values: List[float] = [0.0]
    map_points: List[np.ndarray] = [detected]

    previous_map_point = detected

    frame_idx = 1
    while True:
        ok, frame = capture.read()
        if not ok or frame is None:
            break

        if frame_idx % frame_step != 0:
            frame_idx += 1
            continue

        small = cv2.cvtColor(cv2.resize(frame, (320, 180)), cv2.COLOR_BGR2GRAY)
        diff = cv2.absdiff(small, prev_gray)
        motion_intensity = float(np.mean(diff))

        resized = cv2.resize(frame, (640, 360))
        detected = _detect_red_dot_position(resized, previous_map_point)
        if detected is None:
            detected = previous_map_point

        steering_value = float(np.linalg.norm(detected - previous_map_point) / 640.0 * 100.0)

        raw_speeds.append(motion_intensity)
        steering_values.append(steering_value)
        map_points.append(detected)

        previous_map_point = detected
        prev_gray = small
        frame_idx += 1

    capture.release()

    speeds = _normalize_speed(np.array(raw_speeds, dtype=np.float32))
    steering = np.array(steering_values, dtype=np.float32)

    raw_map_points = np.array(map_points, dtype=np.float32)
    normalized_points = _normalize_map_points(raw_map_points)
    smoothed_points = _moving_average(normalized_points, window=5)

    return VideoAnalysisResult(
        speeds=speeds,
        steering=steering,
        centers=smoothed_points[:, 0],
        map_points=smoothed_points,
        duration_seconds=duration_seconds,
    )


def _phase_label(percent_position: float) -> str:
    if percent_position < 20:
        return "ingresso curva"
    if percent_position < 45:
        return "primo appoggio"
    if percent_position < 70:
        return "centro curva"
    if percent_position < 90:
        return "pre-uscita"
    return "uscita curva"


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


def _braking_reference_label(value: float) -> str:
    if value < 25:
        return "staccata anticipata"
    if value < 55:
        return "staccata intermedia"
    if value < 78:
        return "staccata profonda"
    return "trail braking marcato"


def _extract_curve_indices(map_points: np.ndarray) -> List[int]:
    if map_points.shape[0] < 18:
        return [max(0, map_points.shape[0] // 2)]

    vectors = np.diff(map_points, axis=0)
    headings = np.arctan2(vectors[:, 1], vectors[:, 0])
    heading_deltas = np.diff(headings)
    heading_deltas = (heading_deltas + np.pi) % (2 * np.pi) - np.pi
    turn_strength = np.abs(heading_deltas)

    if turn_strength.size == 0:
        return [max(0, map_points.shape[0] // 2)]

    threshold = float(np.percentile(turn_strength, 72))
    min_distance = max(6, map_points.shape[0] // 20)

    maxima: List[int] = []
    for idx in range(1, turn_strength.size - 1):
        value = turn_strength[idx]
        if value < threshold:
            continue
        if value < turn_strength[idx - 1] or value < turn_strength[idx + 1]:
            continue
        mapped_idx = idx + 1
        if maxima and mapped_idx - maxima[-1] < min_distance:
            if value > turn_strength[maxima[-1] - 1]:
                maxima[-1] = mapped_idx
            continue
        maxima.append(mapped_idx)

    if not maxima:
        max_idx = int(np.argmax(turn_strength)) + 1
        maxima = [max_idx]

    target = max(4, min(16, map_points.shape[0] // 28))
    if len(maxima) > target:
        ranked = sorted(maxima, key=lambda idx: turn_strength[idx - 1], reverse=True)
        maxima = sorted(ranked[:target])

    return maxima


def _build_curve_segments(length: int, corner_indices: List[int]) -> List[CurveSegment]:
    if not corner_indices:
        return [CurveSegment(name="Curva 1", corner_index=max(0, length // 2), start=0, end=length)]

    segments: List[CurveSegment] = []
    boundaries = [0]

    for left, right in zip(corner_indices[:-1], corner_indices[1:]):
        boundaries.append((left + right) // 2)

    boundaries.append(length)

    for idx, corner_idx in enumerate(corner_indices, start=1):
        start = boundaries[idx - 1]
        end = boundaries[idx]
        if end <= start:
            end = min(length, start + 1)

        segments.append(
            CurveSegment(
                name=f"Curva {idx}",
                corner_index=int(corner_idx),
                start=int(start),
                end=int(end),
            )
        )

    return segments


def _build_curve_point(curve: CurveSegment, map_points: np.ndarray, a: Dict[str, float], b: Dict[str, float]) -> Dict[str, object]:
    marker = map_points[min(max(curve.corner_index, 0), map_points.shape[0] - 1)]

    return {
        "curve_name": curve.name,
        "map_marker": {
            "x": round(float(marker[0]), 4),
            "y": round(float(marker[1]), 4),
        },
        "video_a": {
            "braking_speed_kmh": round(a["braking_speed"], 1),
            "braking_point_reference": _braking_reference_label(a["braking_point_pct"]),
            "braking_modulation_score": round(a["braking_modulation"], 1),
            "turn_in_steering": _steering_style(a["turn_in_steering"]),
            "exit_steering": _steering_style(a["exit_steering"]),
            "balance_corrections": _balance_label(a["corrections"]),
            "trajectory": _trajectory_label(a["trajectory_consistency"]),
            "min_corner_speed_kmh": round(a["min_corner_speed"], 1),
            "throttle_open_reference": _phase_label(a["throttle_open_pct"]),
            "full_throttle_reference": _phase_label(a["full_throttle_pct"]),
        },
        "video_b": {
            "braking_speed_kmh": round(b["braking_speed"], 1),
            "braking_point_reference": _braking_reference_label(b["braking_point_pct"]),
            "braking_modulation_score": round(b["braking_modulation"], 1),
            "turn_in_steering": _steering_style(b["turn_in_steering"]),
            "exit_steering": _steering_style(b["exit_steering"]),
            "balance_corrections": _balance_label(b["corrections"]),
            "trajectory": _trajectory_label(b["trajectory_consistency"]),
            "min_corner_speed_kmh": round(b["min_corner_speed"], 1),
            "throttle_open_reference": _phase_label(b["throttle_open_pct"]),
            "full_throttle_reference": _phase_label(b["full_throttle_pct"]),
        },
    }


def _build_report(
    session_name: str,
    track_name: str,
    driver_a: str,
    driver_b: str,
    curves: List[Dict[str, object]],
) -> str:
    lines = [
        f"REPORT COMPARATIVO ONBOARD AUTOMATICO - {session_name}",
        f"Circuito: {track_name or 'Non specificato'}",
        f"Confronto: {driver_a} vs {driver_b}",
        "Metodo: analisi automatica con riferimento GPS (pallino rosso mappa onboard)",
        "",
        "Sintesi ingegnere di pista",
    ]

    braking_a = np.mean([c["video_a"]["braking_speed_kmh"] for c in curves]) if curves else 0
    braking_b = np.mean([c["video_b"]["braking_speed_kmh"] for c in curves]) if curves else 0
    min_a = np.mean([c["video_a"]["min_corner_speed_kmh"] for c in curves]) if curves else 0
    min_b = np.mean([c["video_b"]["min_corner_speed_kmh"] for c in curves]) if curves else 0

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
    lines.append("Analisi curva per curva (vedi marker su mappa)")

    for curve in curves:
        a = curve["video_a"]
        b = curve["video_b"]
        lines.extend(
            [
                "",
                f"{curve['curve_name']}",
                f"- Velocità staccata: {driver_a} {a['braking_speed_kmh']} km/h | {driver_b} {b['braking_speed_kmh']} km/h",
                f"- Punto staccata: {driver_a} {a['braking_point_reference']} | {driver_b} {b['braking_point_reference']}",
                f"- Modulazione staccata (0-10): {driver_a} {a['braking_modulation_score']} | {driver_b} {b['braking_modulation_score']}",
                f"- Inserimento/sterzo ingresso: {driver_a} {a['turn_in_steering']} | {driver_b} {b['turn_in_steering']}",
                f"- Sterzo uscita: {driver_a} {a['exit_steering']} | {driver_b} {b['exit_steering']}",
                f"- Correzioni bilanciamento: {driver_a} {a['balance_corrections']} | {driver_b} {b['balance_corrections']}",
                f"- Traiettoria: {driver_a} {a['trajectory']} | {driver_b} {b['trajectory']}",
                f"- Velocità minima curva: {driver_a} {a['min_corner_speed_kmh']} km/h | {driver_b} {b['min_corner_speed_kmh']} km/h",
                f"- Apertura gas: {driver_a} {a['throttle_open_reference']} | {driver_b} {b['throttle_open_reference']}",
                f"- Full gas: {driver_a} {a['full_throttle_reference']} | {driver_b} {b['full_throttle_reference']}",
            ]
        )

    lines.extend(
        [
            "",
            "Coaching finale",
            "- Concentrarsi sulle curve con maggior differenza di velocità minima e stabilità volante.",
            "- Usare il confronto marker-per-marker sulla mappa per fissare i riferimenti frenata e apertura gas.",
            "- Ripetere analisi dopo run dedicato per misurare miglioramento curva per curva.",
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
    if analysis_length < 18:
        raise ValueError("I video sono troppo corti per una comparazione automatica affidabile")

    truncated_a = VideoAnalysisResult(
        speeds=result_a.speeds[:analysis_length],
        steering=result_a.steering[:analysis_length],
        centers=result_a.centers[:analysis_length],
        map_points=result_a.map_points[:analysis_length],
        duration_seconds=result_a.duration_seconds,
    )
    truncated_b = VideoAnalysisResult(
        speeds=result_b.speeds[:analysis_length],
        steering=result_b.steering[:analysis_length],
        centers=result_b.centers[:analysis_length],
        map_points=result_b.map_points[:analysis_length],
        duration_seconds=result_b.duration_seconds,
    )

    base_path = (truncated_a.map_points + truncated_b.map_points) / 2.0
    corner_indices = _extract_curve_indices(base_path)
    curve_segments = _build_curve_segments(analysis_length, corner_indices)

    curves: List[Dict[str, object]] = []
    for curve in curve_segments:
        a_metrics = _segment_metrics(truncated_a, curve.start, curve.end)
        b_metrics = _segment_metrics(truncated_b, curve.start, curve.end)
        curves.append(_build_curve_point(curve, base_path, a_metrics, b_metrics))

    report = _build_report(session_name, track_name, driver_a_name, driver_b_name, curves)

    path = [{"x": round(float(point[0]), 4), "y": round(float(point[1]), 4)} for point in base_path]
    curve_markers = [
        {
            "name": curve["curve_name"],
            "x": curve["map_marker"]["x"],
            "y": curve["map_marker"]["y"],
        }
        for curve in curves
    ]

    return {
        "session_name": session_name,
        "track_name": track_name,
        "driver_a_name": driver_a_name,
        "driver_b_name": driver_b_name,
        "track_map_provided": bool(track_map_name),
        "track_map_name": track_map_name,
        "analysis_mode": "automatic_gps_red_dot_curve_analysis",
        "sample_count": analysis_length,
        "curves": curves,
        "track_overlay": {
            "source": "onboard_gps_red_dot",
            "path": path,
            "curve_markers": curve_markers,
        },
        "report": report,
    }
