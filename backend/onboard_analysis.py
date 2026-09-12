from __future__ import annotations

import csv
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
    map_outline: np.ndarray
    duration_seconds: float


@dataclass
class CurveSegment:
    name: str
    corner_index: int
    start: int
    end: int


@dataclass
class MapRegion:
    bbox: Tuple[int, int, int, int]
    track_points: np.ndarray
    outline: np.ndarray


_CSV_DATA_START_ROW = 18  # Row 19 in 1-indexed CSV files.


def _parse_elapsed_seconds(value: str) -> Optional[float]:
    text = (value or "").strip()
    if not text:
        return None

    normalized = text.replace(",", ".")
    try:
        return float(normalized)
    except ValueError:
        pass

    parts = normalized.split(":")
    if len(parts) == 2:
        try:
            minutes = float(parts[0])
            seconds = float(parts[1])
            return minutes * 60.0 + seconds
        except ValueError:
            return None
    if len(parts) == 3:
        try:
            hours = float(parts[0])
            minutes = float(parts[1])
            seconds = float(parts[2])
            return hours * 3600.0 + minutes * 60.0 + seconds
        except ValueError:
            return None

    return None


def _parse_float(value: str) -> Optional[float]:
    text = (value or "").strip()
    if not text:
        return None
    try:
        return float(text.replace(",", "."))
    except ValueError:
        return None


def _downsample_points(points: np.ndarray, limit: int = 250) -> np.ndarray:
    if points.shape[0] <= limit:
        return points
    idx = np.linspace(0, points.shape[0] - 1, limit).astype(int)
    return points[idx]


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
    if values.ndim == 1:
        padded = np.pad(values, (pad, pad), mode="edge")
    else:
        pad_width = [(pad, pad)] + [(0, 0)] * (values.ndim - 1)
        padded = np.pad(values, pad_width, mode="edge")
    output = np.zeros_like(values)
    for i in range(values.shape[0]):
        output[i] = np.mean(padded[i:i + window], axis=0)
    return output


def _detect_red_dot_position(
    frame: np.ndarray,
    last_point: Optional[np.ndarray],
    map_region: Optional[MapRegion] = None,
) -> Optional[np.ndarray]:
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    lower_red_1 = np.array([0, 90, 80], dtype=np.uint8)
    upper_red_1 = np.array([10, 255, 255], dtype=np.uint8)
    lower_red_2 = np.array([160, 90, 80], dtype=np.uint8)
    upper_red_2 = np.array([179, 255, 255], dtype=np.uint8)

    mask = cv2.inRange(hsv, lower_red_1, upper_red_1) | cv2.inRange(hsv, lower_red_2, upper_red_2)
    mask = cv2.GaussianBlur(mask, (3, 3), 0)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    candidates: List[Tuple[np.ndarray, float]] = []

    roi_x0 = roi_y0 = roi_x1 = roi_y1 = None
    if map_region is not None:
        x, y, w, h = map_region.bbox
        roi_x0 = max(0, x - 14)
        roi_y0 = max(0, y - 14)
        roi_x1 = min(frame.shape[1] - 1, x + w + 14)
        roi_y1 = min(frame.shape[0] - 1, y + h + 14)

    for contour in contours:
        area = cv2.contourArea(contour)
        if area < 2 or area > 220:
            continue

        moments = cv2.moments(contour)
        if moments["m00"] == 0:
            continue

        center_x = moments["m10"] / moments["m00"]
        center_y = moments["m01"] / moments["m00"]
        if roi_x0 is not None:
            if center_x < roi_x0 or center_x > roi_x1 or center_y < roi_y0 or center_y > roi_y1:
                continue

        perimeter = cv2.arcLength(contour, True)
        circularity = 0.0
        if perimeter > 0:
            circularity = (4 * np.pi * area) / (perimeter ** 2)

        score = circularity * 2.0 - abs(area - 25) / 25.0
        candidates.append((np.array([center_x, center_y], dtype=np.float32), score))

    if not candidates:
        return None

    if last_point is None:
        selected = max(candidates, key=lambda c: c[1])[0]
    else:
        def _score(candidate: Tuple[np.ndarray, float]) -> float:
            point, base_score = candidate
            distance_penalty = np.linalg.norm(point - last_point) / 120.0
            return base_score - distance_penalty

        selected = max(candidates, key=_score)[0]

    if map_region is not None and map_region.track_points.size > 0:
        deltas = map_region.track_points - selected
        nearest_idx = int(np.argmin(np.sum(deltas * deltas, axis=1)))
        nearest_point = map_region.track_points[nearest_idx]
        if np.linalg.norm(nearest_point - selected) <= 24.0:
            selected = nearest_point.astype(np.float32)

    return selected


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


def _normalize_map_points_by_bbox(raw_points: np.ndarray, bbox: Tuple[int, int, int, int]) -> np.ndarray:
    x, y, w, h = bbox
    w = max(1, w)
    h = max(1, h)
    normalized_x = (raw_points[:, 0] - x) / w
    normalized_y = (raw_points[:, 1] - y) / h
    normalized = np.column_stack([normalized_x, normalized_y]).astype(np.float32)
    return np.clip(normalized, 0.0, 1.0)


def _compute_steering_from_path(path_points: np.ndarray) -> np.ndarray:
    if path_points.shape[0] < 2:
        return np.zeros((path_points.shape[0],), dtype=np.float32)

    deltas = np.diff(path_points, axis=0)
    distances = np.linalg.norm(deltas, axis=1) * 100.0
    steering = np.concatenate(([0.0], distances))
    return steering.astype(np.float32)


def _load_csv_trajectory(
    csv_path: Optional[str],
    target_count: int,
    video_duration_seconds: float,
) -> Optional[Tuple[np.ndarray, np.ndarray]]:
    if not csv_path or target_count <= 1:
        return None

    with open(csv_path, "r", encoding="utf-8-sig", errors="replace") as file:
        raw_text = file.read()
    if not raw_text.strip():
        return None

    sample = "\n".join(raw_text.splitlines()[:40])
    try:
        dialect = csv.Sniffer().sniff(sample, delimiters=",;\t")
        delimiter = dialect.delimiter
    except Exception:
        delimiter = ","

    rows = list(csv.reader(raw_text.splitlines(), delimiter=delimiter))
    if len(rows) <= _CSV_DATA_START_ROW:
        return None

    elapsed: List[float] = []
    latitudes: List[float] = []
    longitudes: List[float] = []

    for row in rows[_CSV_DATA_START_ROW:]:
        if len(row) < 3:
            continue
        t = _parse_elapsed_seconds(row[0])
        lat = _parse_float(row[1])
        lon = _parse_float(row[2])
        if t is None or lat is None or lon is None:
            continue
        elapsed.append(t)
        latitudes.append(lat)
        longitudes.append(lon)

    if len(elapsed) < 6:
        return None

    elapsed_arr = np.array(elapsed, dtype=np.float32)
    lat_arr = np.array(latitudes, dtype=np.float32)
    lon_arr = np.array(longitudes, dtype=np.float32)

    order = np.argsort(elapsed_arr)
    elapsed_arr = elapsed_arr[order]
    lat_arr = lat_arr[order]
    lon_arr = lon_arr[order]

    unique_mask = np.ones_like(elapsed_arr, dtype=bool)
    unique_mask[1:] = elapsed_arr[1:] > elapsed_arr[:-1]
    elapsed_arr = elapsed_arr[unique_mask]
    lat_arr = lat_arr[unique_mask]
    lon_arr = lon_arr[unique_mask]

    if elapsed_arr.size < 4:
        return None

    lat0 = float(np.mean(lat_arr))
    lon0 = float(np.mean(lon_arr))
    x_meters = (lon_arr - lon0) * np.cos(np.radians(lat0)) * 111320.0
    y_meters = (lat_arr - lat0) * 110540.0
    points_meters = np.column_stack([x_meters, y_meters]).astype(np.float32)

    x_min, x_max = float(np.min(points_meters[:, 0])), float(np.max(points_meters[:, 0]))
    y_min, y_max = float(np.min(points_meters[:, 1])), float(np.max(points_meters[:, 1]))
    x_range = max(1e-6, x_max - x_min)
    y_range = max(1e-6, y_max - y_min)

    source_duration = float(elapsed_arr[-1] - elapsed_arr[0])
    target_duration = max(1.0, video_duration_seconds) if video_duration_seconds > 0 else max(1.0, source_duration)
    target_times = np.linspace(0.0, target_duration, target_count, dtype=np.float32)
    source_times = elapsed_arr - elapsed_arr[0]
    if source_duration > 1e-3:
        source_times = source_times * (target_duration / source_duration)
    else:
        source_times = np.linspace(0.0, target_duration, elapsed_arr.size, dtype=np.float32)

    interp_x = np.interp(target_times, source_times, points_meters[:, 0])
    interp_y = np.interp(target_times, source_times, points_meters[:, 1])

    normalized_path = np.column_stack([(interp_x - x_min) / x_range, (interp_y - y_min) / y_range]).astype(np.float32)
    normalized_path = np.clip(normalized_path, 0.0, 1.0)
    normalized_path = _moving_average(normalized_path, window=5)

    outline = _downsample_points(normalized_path, limit=300)
    return normalized_path, outline


def _detect_map_region(frame: np.ndarray) -> Optional[MapRegion]:
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    lower_yellow = np.array([12, 80, 80], dtype=np.uint8)
    upper_yellow = np.array([45, 255, 255], dtype=np.uint8)

    mask = cv2.inRange(hsv, lower_yellow, upper_yellow)
    kernel = np.ones((3, 3), dtype=np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    best_contour = None
    best_score = -1.0

    height, width = frame.shape[:2]
    for contour in contours:
        area = cv2.contourArea(contour)
        if area < 350:
            continue

        x, y, w, h = cv2.boundingRect(contour)
        if w < 20 or h < 20:
            continue

        center_y = y + h / 2
        lower_bonus = 1.0 if center_y > height * 0.35 else 0.6
        central_bonus = 1.0 - min(1.0, abs((x + w / 2) - width / 2) / (width / 2))
        score = area * lower_bonus * (0.55 + 0.45 * central_bonus)
        if score > best_score:
            best_score = score
            best_contour = contour

    if best_contour is None:
        return None

    x, y, w, h = cv2.boundingRect(best_contour)
    x = max(0, x - 6)
    y = max(0, y - 6)
    w = min(width - x, w + 12)
    h = min(height - y, h + 12)

    roi_mask = mask[y:y + h, x:x + w]
    ys, xs = np.where(roi_mask > 0)
    if xs.size == 0:
        return None

    track_points = np.column_stack([xs + x, ys + y]).astype(np.float32)
    sampled_idx = np.linspace(0, track_points.shape[0] - 1, min(5000, track_points.shape[0])).astype(int)
    sampled_track_points = track_points[sampled_idx]

    epsilon = 0.0025 * cv2.arcLength(best_contour, True)
    polygon = cv2.approxPolyDP(best_contour, epsilon, True).reshape(-1, 2).astype(np.float32)
    if polygon.shape[0] < 3:
        polygon = best_contour.reshape(-1, 2).astype(np.float32)

    outline_normalized = _normalize_map_points_by_bbox(polygon, (x, y, w, h))
    return MapRegion(bbox=(x, y, w, h), track_points=sampled_track_points, outline=outline_normalized)


def _extract_outline_from_reference_map(track_map_path: Optional[str]) -> np.ndarray:
    if not track_map_path:
        return np.zeros((0, 2), dtype=np.float32)

    image = cv2.imread(track_map_path)
    if image is None:
        return np.zeros((0, 2), dtype=np.float32)

    resized = cv2.resize(image, (640, 360))
    region = _detect_map_region(resized)
    if region is None or region.outline.size == 0:
        return np.zeros((0, 2), dtype=np.float32)

    return region.outline


def analyze_video(video_path: str, csv_path: Optional[str] = None, sample_rate_hz: float = 8.0) -> VideoAnalysisResult:
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
    map_region = _detect_map_region(resized)
    prev_gray = cv2.cvtColor(cv2.resize(frame, (320, 180)), cv2.COLOR_BGR2GRAY)

    detected = _detect_red_dot_position(resized, None, map_region)
    if detected is None:
        if map_region is not None:
            x, y, w, h = map_region.bbox
            detected = np.array([x + w / 2, y + h / 2], dtype=np.float32)
        else:
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
        detected = _detect_red_dot_position(resized, previous_map_point, map_region)
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
    if map_region is not None:
        normalized_points = _normalize_map_points_by_bbox(raw_map_points, map_region.bbox)
        map_outline = map_region.outline
    else:
        normalized_points = _normalize_map_points(raw_map_points)
        map_outline = np.zeros((0, 2), dtype=np.float32)
    smoothed_points = _moving_average(normalized_points, window=5)

    csv_trajectory = _load_csv_trajectory(csv_path, target_count=speeds.shape[0], video_duration_seconds=duration_seconds)
    if csv_trajectory is not None:
        csv_path_points, csv_outline = csv_trajectory
        smoothed_points = csv_path_points
        map_outline = csv_outline
        steering = _compute_steering_from_path(smoothed_points)

    return VideoAnalysisResult(
        speeds=speeds,
        steering=steering,
        centers=smoothed_points.copy(),
        map_points=smoothed_points,
        map_outline=map_outline,
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

    if centers.ndim == 2 and centers.shape[0] > 2:
        vectors = np.diff(centers, axis=0)
        step_norms = np.linalg.norm(vectors, axis=1)
        headings = np.arctan2(vectors[:, 1], vectors[:, 0])
        heading_deltas = np.diff(headings)
        heading_deltas = (heading_deltas + np.pi) % (2 * np.pi) - np.pi

        valid_heading = np.where(np.abs(heading_deltas) > 0.12, np.sign(heading_deltas), 0.0)
        sign_changes = int(np.sum((valid_heading[1:] * valid_heading[:-1]) < 0))
        corrections = float(min(10.0, sign_changes * 1.7))

        trajectory_consistency = float(
            np.clip(100.0 - np.std(heading_deltas) * 130.0 - np.std(step_norms) * 120.0, 35.0, 100.0)
        )
    else:
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
        if value <= turn_strength[idx - 1] or value <= turn_strength[idx + 1]:
            continue
        mapped_idx = idx + 1
        if maxima and mapped_idx - maxima[-1] < min_distance:
            previous_idx = min(max(0, maxima[-1] - 1), turn_strength.size - 1)
            if value > turn_strength[previous_idx]:
                maxima[-1] = mapped_idx
            continue
        maxima.append(mapped_idx)

    if not maxima:
        max_idx = int(np.argmax(turn_strength)) + 1
        maxima = [max_idx]

    target = max(4, min(16, map_points.shape[0] // 28))
    if len(maxima) > target:
        ranked = sorted(maxima, key=lambda idx: turn_strength[min(max(0, idx - 1), turn_strength.size - 1)], reverse=True)
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
        "Metodo: analisi automatica con traiettorie GPS da CSV allineate ai video",
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
    csv_a_path: Optional[str],
    csv_b_path: Optional[str],
    session_name: str,
    track_name: str,
    driver_a_name: str,
    driver_b_name: str,
    track_map_path: Optional[str] = None,
) -> Dict[str, object]:
    result_a = analyze_video(video_a_path, csv_path=csv_a_path)
    result_b = analyze_video(video_b_path, csv_path=csv_b_path)

    analysis_length = int(min(result_a.speeds.size, result_b.speeds.size))
    if analysis_length < 18:
        raise ValueError("I video sono troppo corti per una comparazione automatica affidabile")

    truncated_a = VideoAnalysisResult(
        speeds=result_a.speeds[:analysis_length],
        steering=result_a.steering[:analysis_length],
        centers=result_a.centers[:analysis_length],
        map_points=result_a.map_points[:analysis_length],
        map_outline=result_a.map_outline,
        duration_seconds=result_a.duration_seconds,
    )
    truncated_b = VideoAnalysisResult(
        speeds=result_b.speeds[:analysis_length],
        steering=result_b.steering[:analysis_length],
        centers=result_b.centers[:analysis_length],
        map_points=result_b.map_points[:analysis_length],
        map_outline=result_b.map_outline,
        duration_seconds=result_b.duration_seconds,
    )

    base_path = (truncated_a.map_points + truncated_b.map_points) / 2.0
    reference_outline = _extract_outline_from_reference_map(track_map_path)

    if reference_outline.size > 0:
        base_outline = reference_outline
    elif truncated_a.map_outline.size > 0 and truncated_b.map_outline.size > 0:
        if truncated_a.map_outline.shape == truncated_b.map_outline.shape:
            base_outline = (truncated_a.map_outline + truncated_b.map_outline) / 2.0
        else:
            base_outline = truncated_a.map_outline
    elif truncated_a.map_outline.size > 0:
        base_outline = truncated_a.map_outline
    else:
        base_outline = truncated_b.map_outline

    corner_indices = _extract_curve_indices(base_path)
    curve_segments = _build_curve_segments(analysis_length, corner_indices)

    curves: List[Dict[str, object]] = []
    for curve in curve_segments:
        a_metrics = _segment_metrics(truncated_a, curve.start, curve.end)
        b_metrics = _segment_metrics(truncated_b, curve.start, curve.end)
        curves.append(_build_curve_point(curve, base_path, a_metrics, b_metrics))

    report = _build_report(session_name, track_name, driver_a_name, driver_b_name, curves)

    path = [{"x": round(float(point[0]), 4), "y": round(float(point[1]), 4)} for point in base_path]
    circuit_outline = [{"x": round(float(point[0]), 4), "y": round(float(point[1]), 4)} for point in base_outline]
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
        "analysis_mode": "automatic_csv_aligned_trajectory_analysis",
        "csv_trajectory_used": bool(csv_a_path and csv_b_path),
        "sample_count": analysis_length,
        "curves": curves,
        "track_overlay": {
            "source": "onboard_gps_red_dot",
            "circuit_outline": circuit_outline,
            "path": path,
            "curve_markers": curve_markers,
        },
        "report": report,
    }
