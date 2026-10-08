"""
Multimodal Computer Vision Analysis for Citizen Field Photos.
Simulates Amazon Rekognition / Bedrock Claude Vision inference
to classify waterlogging depth, pipeline bursts, debris, and accessibility hazards.
Supports real image pixel analysis via Pillow (PIL).
"""
import io
from typing import Dict, Any, Optional

try:
    from PIL import Image, ImageStat
except ImportError:
    Image = None
    ImageStat = None

class CitizenImageAnalyzer:
    def __init__(self):
        self.model_id = "arn:aws:bedrock:ap-south-1:foundation-model/anthropic.claude-3-5-sonnet"

    def analyze_image(self, category: str, description: str, image_bytes_len: int = 0, image_bytes: bytes = b"") -> Dict[str, Any]:
        """
        Extracts structured environmental hazard indicators from real uploaded image bytes and user notes.
        """
        desc_lower = description.lower()
        image_metadata = {"has_image": False}

        # Analyze real image pixels if image_bytes are present
        if image_bytes and Image:
            try:
                img = Image.open(io.BytesIO(image_bytes))
                width, height = img.size
                image_metadata = {
                    "has_image": True,
                    "width": width,
                    "height": height,
                    "format": img.format or "JPEG",
                    "aspect_ratio": round(width / max(1, height), 2)
                }

                # Quick pixel statistical analysis
                rgb_img = img.convert("RGB")
                stat = ImageStat.Stat(rgb_img)
                avg_r, avg_g, avg_b = stat.mean[:3]
                image_metadata["avg_rgb"] = [round(avg_r, 1), round(avg_g, 1), round(avg_b, 1)]
                image_metadata["brightness"] = round((avg_r + avg_g + avg_b) / 3, 1)

                # Heuristic for water / dark puddle presence (gray-brown-blue tint)
                is_dark_or_turbid = image_metadata["brightness"] < 130
                image_metadata["turbidity_detected"] = is_dark_or_turbid
            except Exception as e:
                image_metadata["error"] = str(e)

        # Category-specific inference
        if category == "waterlogging" or "water" in desc_lower or "flood" in desc_lower:
            has_deep_keywords = any(w in desc_lower for w in ["waist", "knee", "submerged", "stuck", "heavy", "deep", "drown"])
            has_debris_keywords = any(w in desc_lower for w in ["garbage", "choked", "trash", "debris", "drain", "blocked", "clogged"])

            depth_val = 45 if has_deep_keywords else 25
            if image_metadata.get("has_image") and image_metadata.get("turbidity_detected"):
                depth_val += 10 # Corroborate with dark muddy water pixels

            depth_cm = f"{depth_val - 10} - {depth_val + 10} cm"
            passability = "IMPASSABLE FOR LIGHT VEHICLES" if depth_val >= 35 else "PARTIAL TRAFFIC SLOWDOWN"
            debris = has_debris_keywords or depth_val >= 40
            confidence = 0.96 if image_metadata.get("has_image") else 0.91

            return {
                "detected_category": "Severe Urban Waterlogging",
                "estimated_water_depth_cm": depth_cm,
                "road_passability": passability,
                "debris_detected": debris,
                "open_manhole_hazard": "High Risk - Submerged Vortex" if debris else "Low Risk",
                "severity_score": round(min(0.98, 0.70 + (depth_val / 200)), 2),
                "model_confidence": confidence,
                "vision_tags": ["water_inundation", "roadway_obstruction", "curb_submerged", "traffic_standstill"],
                "image_metadata": image_metadata,
                "bounding_boxes": [
                    {"label": "Submerged Road Surface", "confidence": 0.94, "box": [0.15, 0.40, 0.85, 0.90]},
                    {"label": "Waterline Curb Datum", "confidence": 0.91, "box": [0.30, 0.55, 0.70, 0.75]},
                    {"label": "Clogged Drainage Ingress", "confidence": 0.88, "box": [0.60, 0.65, 0.90, 0.85]}
                ]
            }

        elif category == "leak" or "pipe" in desc_lower or "burst" in desc_lower or "potable" in desc_lower:
            return {
                "detected_category": "High-Pressure Water Main Rupture",
                "estimated_water_depth_cm": "10 - 20 cm continuous flow",
                "road_passability": "SURFACE EROSION / LANE HAZARD",
                "debris_detected": False,
                "open_manhole_hazard": "Pavement Undermining Risk",
                "severity_score": 0.88,
                "model_confidence": 0.94 if image_metadata.get("has_image") else 0.90,
                "vision_tags": ["potable_water_spurt", "asphalt_fissure", "utility_duct_leak"],
                "image_metadata": image_metadata,
                "bounding_boxes": [
                    {"label": "Pressurized Water Jet", "confidence": 0.92, "box": [0.25, 0.35, 0.75, 0.80]}
                ]
            }

        elif category == "heatwave" or "heat" in desc_lower or "sun" in desc_lower:
            return {
                "detected_category": "Urban Heat Island & Thermal Distress",
                "estimated_water_depth_cm": "N/A (Thermal Hazard)",
                "road_passability": "PASSABLE - EXTREME SURFACE HEAT",
                "debris_detected": False,
                "open_manhole_hazard": "None",
                "severity_score": 0.84,
                "model_confidence": 0.92 if image_metadata.get("has_image") else 0.88,
                "vision_tags": ["sun_exposure", "asphalt_thermal_radiation", "pedestrian_vulnerability"],
                "image_metadata": image_metadata,
                "bounding_boxes": [
                    {"label": "Unshaded Pedestrian Corridor", "confidence": 0.89, "box": [0.10, 0.20, 0.90, 0.85]}
                ]
            }

        else: # water_shortage
            return {
                "detected_category": "Potable Water Deficit / Dry Supply Tap",
                "estimated_water_depth_cm": "0 cm (Critical Shortage)",
                "road_passability": "PASSABLE - CROWD ACCUMULATION",
                "debris_detected": False,
                "open_manhole_hazard": "None",
                "severity_score": 0.86,
                "model_confidence": 0.93 if image_metadata.get("has_image") else 0.89,
                "vision_tags": ["empty_receptacles", "water_ration_queue", "dry_distribution_point"],
                "image_metadata": image_metadata,
                "bounding_boxes": [
                    {"label": "Depleted Water Point", "confidence": 0.90, "box": [0.20, 0.30, 0.80, 0.85]}
                ]
            }

image_analyzer = CitizenImageAnalyzer()
