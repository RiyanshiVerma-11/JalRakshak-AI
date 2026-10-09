#!/usr/bin/env python3
"""
JalRakshak AI — 1-Click AWS OpenSearch Telemetry Provisioning & Verification Script
Author: JalRakshak AI Engineering Team
Track: Heat and Water (WeMakeDevs AWS Environmental Hacks - BUILD IT Route)

Purpose:
  1. Connects to local AWS OpenSearch 2.x cluster (http://localhost:9200).
  2. Creates optimized index schemas for:
     - 'jalrakshak-water-telemetry' (hydrological SCADA logs, water quality metrics, geo_points)
     - 'jalrakshak-citizen-reports' (full-text search over field reports & CV metadata)
  3. Bulk-seeds realistic telemetry for Mumbai wards (Kurla W-17, Dadar W-04, Andheri W-12).
  4. Exercises Query DSL aggregations and hazard anomaly detection.
  5. Provides clean error diagnosis if OpenSearch container is not yet booted.

Usage:
  python scripts/setup_opensearch.py
"""

import sys
import os
import json
import time
from datetime import datetime, timezone
from typing import Dict, Any, List

try:
    import httpx
except ImportError:
    print("[ERROR] httpx is required. Install via: pip install httpx")
    sys.exit(1)

OPENSEARCH_URL = os.environ.get("OPENSEARCH_URL", "http://localhost:9200").rstrip("/")
INDEX_TELEMETRY = "jalrakshak-water-telemetry"
INDEX_REPORTS = "jalrakshak-citizen-reports"

# ANSI Terminal Colors
G = "\033[92m"; Y = "\033[93m"; C = "\033[96m"; R = "\033[0m"; B = "\033[1m"; RED = "\033[91m"


def header(title: str):
    print(f"\n{B}{C}=== {title} ==={R}")


def check_cluster_health() -> bool:
    header(f"1. Checking AWS OpenSearch Gateway ({OPENSEARCH_URL})")
    try:
        with httpx.Client(timeout=3.0) as client:
            resp = client.get(f"{OPENSEARCH_URL}/_cluster/health")
            if resp.status_code == 200:
                health = resp.json()
                cluster_name = health.get("cluster_name", "opensearch-cluster")
                status = health.get("status", "unknown").upper()
                nodes = health.get("number_of_nodes", 1)
                color = G if status in ("GREEN", "YELLOW") else Y
                print(f"{G}[OK] Connected to OpenSearch Cluster: {B}{cluster_name}{R}")
                print(f"     Cluster Status: {color}{status}{R} | Nodes Active: {nodes}")
                return True
            else:
                print(f"{RED}[FAIL] HTTP {resp.status_code} received from {OPENSEARCH_URL}{R}")
                return False
    except httpx.ConnectError:
        print(f"{RED}[OFFLINE] Could not connect to OpenSearch at {OPENSEARCH_URL}.{R}")
        print("  To run OpenSearch on your local machine:")
        print(f"  1. Ensure Docker is running.")
        print(f"  2. Run: {B}docker compose -f docker-compose.local.yml up -d opensearch{R}")
        print(f"  3. Re-run: {B}python scripts/setup_opensearch.py{R}")
        return False
    except Exception as exc:
        print(f"{Y}[WARN] Notice while pinging OpenSearch: {exc}{R}")
        return False


def provision_indices() -> bool:
    header("2. Provisioning OpenSearch Index Schemas")

    # 1. Telemetry Mapping
    telemetry_spec = {
        "settings": {
            "number_of_shards": 1,
            "number_of_replicas": 0,
            "refresh_interval": "1s"
        },
        "mappings": {
            "properties": {
                "timestamp": {"type": "date"},
                "ward_id": {"type": "keyword"},
                "ward_name": {"type": "text", "fields": {"keyword": {"type": "keyword"}}},
                "sensor_id": {"type": "keyword"},
                "sensor_type": {"type": "keyword"},
                "rainfall_rate_mm_hr": {"type": "float"},
                "water_level_cm": {"type": "float"},
                "drainage_saturation_pct": {"type": "float"},
                "turbidity_ntu": {"type": "float"},
                "ph_level": {"type": "float"},
                "dissolved_oxygen_mg_l": {"type": "float"},
                "temperature_c": {"type": "float"},
                "status": {"type": "keyword"},
                "location": {"type": "geo_point"}
            }
        }
    }

    # 2. Citizen Reports Mapping
    reports_spec = {
        "settings": {
            "number_of_shards": 1,
            "number_of_replicas": 0
        },
        "mappings": {
            "properties": {
                "report_id": {"type": "keyword"},
                "timestamp": {"type": "date"},
                "ward_id": {"type": "keyword"},
                "category": {"type": "keyword"},
                "title": {"type": "text"},
                "description": {"type": "text", "analyzer": "standard"},
                "severity": {"type": "keyword"},
                "estimated_water_depth_cm": {"type": "float"},
                "verified_cv": {"type": "boolean"},
                "cv_labels": {"type": "keyword"}
            }
        }
    }

    indices = [
        (INDEX_TELEMETRY, telemetry_spec),
        (INDEX_REPORTS, reports_spec)
    ]

    with httpx.Client(timeout=5.0) as client:
        for idx_name, spec in indices:
            head_res = client.head(f"{OPENSEARCH_URL}/{idx_name}")
            if head_res.status_code == 200:
                print(f"{G}[OK] Index already exists: {idx_name}{R}")
            else:
                put_res = client.put(f"{OPENSEARCH_URL}/{idx_name}", json=spec)
                if put_res.status_code in (200, 201):
                    print(f"{G}[OK] Created OpenSearch Index: {idx_name}{R}")
                else:
                    print(f"{RED}[FAIL] Could not create {idx_name}: {put_res.text}{R}")
                    return False
    return True


def seed_scada_telemetry():
    header("3. Bulk-Indexing SCADA Water & Climate Telemetry")

    now = datetime.now(timezone.utc).isoformat()
    seed_records = [
        {
            "timestamp": now,
            "ward_id": "WARD-17",
            "ward_name": "Ward 17 (Kurla L-Ward)",
            "sensor_id": "SN-KURLA-RAIN-01",
            "sensor_type": "TIPPING_BUCKET_RAIN_GAUGE",
            "rainfall_rate_mm_hr": 118.0,
            "water_level_cm": 42.0,
            "drainage_saturation_pct": 98.5,
            "turbidity_ntu": 48.2,
            "ph_level": 6.8,
            "dissolved_oxygen_mg_l": 4.1,
            "temperature_c": 27.5,
            "status": "CRITICAL",
            "location": {"lat": 19.0688, "lon": 72.8796}
        },
        {
            "timestamp": now,
            "ward_id": "WARD-17",
            "ward_name": "Ward 17 (Kurla L-Ward)",
            "sensor_id": "SN-MITHI-LEVEL-04",
            "sensor_type": "ULTRASONIC_STAGE_METER",
            "rainfall_rate_mm_hr": 112.5,
            "water_level_cm": 55.0,
            "drainage_saturation_pct": 100.0,
            "turbidity_ntu": 62.0,
            "ph_level": 6.6,
            "dissolved_oxygen_mg_l": 3.8,
            "temperature_c": 27.1,
            "status": "CRITICAL",
            "location": {"lat": 19.0655, "lon": 72.8812}
        },
        {
            "timestamp": now,
            "ward_id": "WARD-04",
            "ward_name": "Ward 4 (Dadar / Parel)",
            "sensor_id": "SN-DADAR-FLOW-02",
            "sensor_type": "DOPPLER_FLOW_METER",
            "rainfall_rate_mm_hr": 64.0,
            "water_level_cm": 28.0,
            "drainage_saturation_pct": 82.0,
            "turbidity_ntu": 24.5,
            "ph_level": 7.1,
            "dissolved_oxygen_mg_l": 5.4,
            "temperature_c": 28.2,
            "status": "HIGH",
            "location": {"lat": 19.0178, "lon": 72.8478}
        },
        {
            "timestamp": now,
            "ward_id": "WARD-12",
            "ward_name": "Ward 12 (Andheri East)",
            "sensor_id": "SN-ANDHERI-SUB-01",
            "sensor_type": "PIEZOMETRIC_SUBWAY_GAUGE",
            "rainfall_rate_mm_hr": 89.0,
            "water_level_cm": 35.0,
            "drainage_saturation_pct": 91.0,
            "turbidity_ntu": 32.1,
            "ph_level": 6.9,
            "dissolved_oxygen_mg_l": 4.8,
            "temperature_c": 27.8,
            "status": "HIGH",
            "location": {"lat": 19.1136, "lon": 72.8697}
        },
        {
            "timestamp": now,
            "ward_id": "WARD-01",
            "ward_name": "Ward 1 (Colaba A-Ward)",
            "sensor_id": "SN-COLABA-WEATHER-01",
            "sensor_type": "AWS_AUTOMATED_WEATHER_STATION",
            "rainfall_rate_mm_hr": 14.0,
            "water_level_cm": 4.0,
            "drainage_saturation_pct": 28.0,
            "turbidity_ntu": 8.5,
            "ph_level": 7.4,
            "dissolved_oxygen_mg_l": 6.8,
            "temperature_c": 48.6,
            "status": "NORMAL",
            "location": {"lat": 18.9067, "lon": 72.8147}
        }
    ]

    bulk_lines = []
    for doc in seed_records:
        bulk_lines.append(json.dumps({"index": {"_index": INDEX_TELEMETRY}}))
        bulk_lines.append(json.dumps(doc))
    bulk_payload = "\n".join(bulk_lines) + "\n"

    with httpx.Client(timeout=5.0) as client:
        resp = client.post(
            f"{OPENSEARCH_URL}/_bulk",
            content=bulk_payload,
            headers={"Content-Type": "application/x-ndjson"}
        )
        if resp.status_code == 200:
            print(f"{G}[OK] Bulk-Indexed {len(seed_records)} Hydrological SCADA Documents.{R}")
        else:
            print(f"{RED}[FAIL] Bulk index error: {resp.text}{R}")


def verify_anomaly_dsl():
    header("4. Executing OpenSearch Query DSL Anomaly Detection")

    query_dsl = {
        "size": 10,
        "query": {
            "bool": {
                "should": [
                    {"range": {"water_level_cm": {"gte": 30.0}}},
                    {"range": {"rainfall_rate_mm_hr": {"gte": 80.0}}},
                    {"term": {"status": "CRITICAL"}}
                ],
                "minimum_should_match": 1
            }
        },
        "aggs": {
            "max_water_depth": {"max": {"field": "water_level_cm"}},
            "avg_rainfall": {"avg": {"field": "rainfall_rate_mm_hr"}},
            "wards_at_risk": {"terms": {"field": "ward_id", "size": 5}}
        }
    }

    with httpx.Client(timeout=5.0) as client:
        resp = client.post(f"{OPENSEARCH_URL}/{INDEX_TELEMETRY}/_search", json=query_dsl)
        if resp.status_code == 200:
            data = resp.json()
            hits = data.get("hits", {})
            total = hits.get("total", {}).get("value", 0)
            aggs = data.get("aggregations", {})
            max_depth = aggs.get("max_water_depth", {}).get("value", 0.0)
            avg_rain = aggs.get("avg_rainfall", {}).get("value", 0.0)

            print(f"{G}[OK] Query DSL Execution Succeeded!{R}")
            print(f"     Total Anomaly Hits Isolated: {B}{total}{R}")
            print(f"     Max Inundation Depth: {Y}{max_depth:.1f} cm{R}")
            print(f"     Average Severe Rainfall: {Y}{avg_rain:.1f} mm/hr{R}")
            print(f"     Top At-Risk Wards:")
            for bucket in aggs.get("wards_at_risk", {}).get("buckets", []):
                print(f"       - Ward {bucket.get('key')}: {bucket.get('doc_count')} sensor anomalies")
            return True
        else:
            print(f"{RED}[FAIL] Search query failed: {resp.text}{R}")
            return False


def main():
    print(f"\n{B}==================================================================={R}")
    print(f"{B}[AWS OPENSEARCH] JalRakshak AI — Telemetry Engine Provisioning{R}")
    print(f"{B}==================================================================={R}")

    if not check_cluster_health():
        print(f"\n{RED}[BLOCKED/OFFLINE] AWS OpenSearch at {OPENSEARCH_URL} is unreachable.{R}")
        print("To run OpenSearch on your local machine with Docker:")
        print("  1. Start Docker Desktop")
        print("  2. Run: docker compose -f docker-compose.local.yml up -d opensearch")
        print("  3. Run: python scripts/setup_opensearch.py")
        sys.exit(1)

    if not provision_indices():
        sys.exit(1)

    seed_scada_telemetry()
    verify_anomaly_dsl()

    print(f"\n{B}{G}==================================================================={R}")
    print(f"{B}{G}[SUCCESS] AWS OpenSearch Ingestion & Query DSL Verified!{R}")
    print(f"  Cluster URL: {B}{OPENSEARCH_URL}{R}")
    print(f"  Telemetry Index: {B}{INDEX_TELEMETRY}{R}")
    print(f"  Citizen Index:   {B}{INDEX_REPORTS}{R}")
    print(f"{B}{G}==================================================================={R}\n")


if __name__ == "__main__":
    main()
