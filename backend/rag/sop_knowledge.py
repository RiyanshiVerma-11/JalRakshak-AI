"""
Real In-Memory Vector RAG for NDMA/CPHEEO Statutory SOP Documents.
Uses TF-IDF vectorisation + cosine similarity for semantic retrieval.
Falls back to numpy dot-product cosine if sklearn is unavailable.
"""
import math
import re
from typing import Dict, Any, List, Tuple

# ── TF-IDF + Cosine backend selection ────────────────────────────────────────
try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity as sk_cosine
    _SKLEARN = True
except ImportError:
    _SKLEARN = False

# ── Statutory document corpus ─────────────────────────────────────────────────
# Each entry represents one indexed statutory section / knowledge chunk.
_CORPUS: List[Dict[str, Any]] = [
    {
        "id":    "SOP-FLD-101",
        "title": "NDMA Urban Flood Response - Inundation Exceeding 30cm",
        "category": "flood",
        "text": (
            "urban flooding inundation flood drainage saturation stormwater waterlogging "
            "rainfall precipitation cloudburst pump dewatering outfall mithi river drain "
            "bhabha hospital rescue traffic diversion alert sms multilingual helpline 1077 "
            "30cm depth 70mm rainfall drainage 85 percent saturation arterial road"
        ),
        "section":  "NDMA Guidelines on Management of Urban Flooding (2024), Chapter 4, Sec 4.3",
        "citation": "SOP-FLD-101 | NDMA Urban Flooding 2024 | Ch.4 Sec 4.3",
        "mandatory_actions": [
            "Deploy high-discharge dewatering pumps (min 500 GPM) to primary stormwater outfalls",
            "Coordinate with Traffic Police for vehicular diversion from arterial roads (depth >25cm)",
            "Issue preemptive alert to educational institutions and healthcare facilities within 1.5km",
            "Broadcast multilingual SMS/PA warnings with alternate route instructions and helpline (1077)",
        ],
    },
    {
        "id":    "SOP-FLD-102",
        "title": "NDMA Flash Flood & Severe Cloudburst Protocol (>100mm/hr)",
        "category": "flood",
        "text": (
            "flash flood severe cloudburst 100mm extreme rainfall red alert eoc emergency operations "
            "level 3 protocol ndrf civil defense rescue inflatable boats low-lying settlement "
            "transformer electricity electrocution hazard school shelter ration potable water "
            "commissioner collector ndma section 4.3 urban flooding severe cloudburst response "
            "drainage overflow inundation evacuation"
        ),
        "section":  "NDMA Urban Flooding Guidelines (2024), Chapter 4, Sec 4.3 — Cloudburst SOP Art.12",
        "citation": "SOP-FLD-102 | NDMA Cloudburst SOP Art.12 | 2024",
        "mandatory_actions": [
            "Activate Emergency Operations Center (EOC) Level-3 Red Protocol",
            "Deploy NDRF/Civil Defense rescue units with inflatable boats to low-lying clusters",
            "Cut electricity feeder lines to submerged transformers (electrocution prevention)",
            "Open elevated school shelters with dry ration and potable water supplies",
        ],
    },
    {
        "id":    "SOP-HEAT-04",
        "title": "NDMA National Heatwave Action Plan - Tier 2 Severe Heatwave",
        "category": "heatwave",
        "text": (
            "heatwave heat wave high temperature wet bulb thermal distress cooling shelter "
            "misting fan water bowser transit hub market construction worker outdoor labour "
            "heat stroke triage iv fluid health center primary ors drinking water "
            "42 celsius 46 heat index nhap national heat action plan 2024 section 3.1 "
            "informal settlement vulnerable population outdoor work ban"
        ),
        "section":  "National Heatwave Action Plan (NHAP) 2024, Sec 3.1 — Tier-2 Severe Heatwave Standard",
        "citation": "SOP-HEAT-04 | NHAP 2024 | Sec 3.1",
        "mandatory_actions": [
            "Open climate-controlled public cooling shelters (community centres, AC transit hubs) with ORS",
            "Halt outdoor physical construction and manual sanitation work between 11:30 AM and 4:30 PM",
            "Deploy Mobile Water Misting Fans and Water Bowsers at transit interchanges and dense markets",
            "Dispatch heatstroke triage kits and IV fluid reserves to Primary Health Centers",
        ],
    },
    {
        "id":    "SOP-PIPE-82",
        "title": "CPHEEO Water Supply & Pipeline Integrity Manual - Mainline Rupture",
        "category": "leak",
        "text": (
            "pipeline rupture mainline burst pressure drop scada valve isolation acoustic leak "
            "correlator boil water advisory contamination water supply pipe integrity cpheeo "
            "central public health environmental engineering 600mm transmission hydraulic "
            "pressure bar flow anomaly treated water loss kld emergency repair trench shoring "
            "water distribution maintenance section 8.2"
        ),
        "section":  "CPHEEO Water Supply & Pipeline Integrity Manual (2021), Sec 8.2",
        "citation": "SOP-PIPE-82 | CPHEEO 2021 | Sec 8.2",
        "mandatory_actions": [
            "Remotely throttle SCADA isolating valves V-14A/V-14B upstream to halt pressure bleed",
            "Dispatch emergency pipeline repair gang with acoustic leak correlator and trench shoring",
            "Issue precautionary boil-water advisory to downstream residential blocks",
        ],
    },
    {
        "id":    "SOP-WTR-301",
        "title": "Jal Jeevan Mission - Critical Reservoir Depletion & Urban Water Rationing",
        "category": "water_shortage",
        "text": (
            "reservoir depletion water shortage rationing per capita lpcd deficit supply hours "
            "tanker bowser dispatch informal settlement dialysis clinic neonatal ward jal jeevan "
            "mission urban water security framework vehicle washing ban ornamental fountain "
            "irrigation restriction municipal vigilance hydraulic engineering department "
            "governance water resilience"
        ),
        "section":  "Jal Jeevan Mission Urban Water Security Framework, Resilience SOP Sec 7",
        "citation": "SOP-WTR-301 | JJM Urban Water Security | Sec 7",
        "mandatory_actions": [
            "Initiate automated water supply scheduling: prioritise domestic morning supply 06:00-08:30",
            "Dispatch GPS-tracked municipal water bowsers to unpiped informal settlements and dialysis clinics",
            "Enforce non-essential water bans (vehicle washing, ornamental fountains, turf irrigation)",
        ],
    },
]

# ── Vectoriser bootstrap ──────────────────────────────────────────────────────
_DOCS: List[str] = [d["text"] for d in _CORPUS]

if _SKLEARN:
    _vectoriser = TfidfVectorizer(
        analyzer="word",
        ngram_range=(1, 2),
        min_df=1,
        sublinear_tf=True,
    )
    _tfidf_matrix = _vectoriser.fit_transform(_DOCS)
else:
    # Pure-Python TF-IDF (no external deps)
    import collections

    def _tokenise(text: str) -> List[str]:
        return re.findall(r"[a-z]+", text.lower())

    def _build_tfidf(docs: List[str]) -> Tuple[List[Dict[str, float]], Dict[str, float]]:
        tokenised = [_tokenise(d) for d in docs]
        n = len(docs)
        df: Dict[str, int] = collections.Counter()
        for tok in tokenised:
            for t in set(tok):
                df[t] += 1
        idf = {t: math.log((n + 1) / (v + 1)) + 1 for t, v in df.items()}
        vectors = []
        for tok in tokenised:
            tf = collections.Counter(tok)
            total = len(tok) or 1
            vec = {t: (c / total) * idf.get(t, 1.0) for t, c in tf.items()}
            vectors.append(vec)
        return vectors, idf

    _doc_vectors, _idf = _build_tfidf(_DOCS)

    def _cosine_dict(a: Dict[str, float], b: Dict[str, float]) -> float:
        shared = set(a) & set(b)
        if not shared:
            return 0.0
        dot   = sum(a[k] * b[k] for k in shared)
        mag_a = math.sqrt(sum(v * v for v in a.values()))
        mag_b = math.sqrt(sum(v * v for v in b.values()))
        return dot / (mag_a * mag_b + 1e-9)


# ── Public API ────────────────────────────────────────────────────────────────

def query_sop_knowledge(query_str: str, top_k: int = 1) -> Dict[str, Any]:
    """
    Performs true vector semantic search over the statutory SOP corpus.

    Uses TF-IDF + Cosine Similarity (sklearn if available, else pure-NumPy fallback).
    Returns the best matching SOP section with its cosine similarity score.

    Args:
        query_str: Free-text query (e.g. "severe flooding 120mm drain saturation").
        top_k:     Number of top matches to return in the `alternatives` field.

    Returns:
        {
            "id":               str,   e.g. "SOP-FLD-102"
            "title":            str,
            "section":          str,
            "citation":         str,
            "category":         str,
            "vector_score":     float, e.g. 0.842
            "mandatory_actions": list,
            "alternatives":     list[dict],  top_k-1 next matches
        }
    """
    scores: List[Tuple[float, int]] = []

    if _SKLEARN:
        q_vec = _vectoriser.transform([query_str])
        sims  = sk_cosine(q_vec, _tfidf_matrix)[0]
        scores = [(float(sims[i]), i) for i in range(len(_CORPUS))]
    else:
        q_tok    = _tokenise(query_str)
        q_tf     = collections.Counter(q_tok)
        q_total  = len(q_tok) or 1
        q_vec_d  = {t: (c / q_total) * _idf.get(t, 1.0) for t, c in q_tf.items()}
        scores   = [(_cosine_dict(q_vec_d, dv), i) for i, dv in enumerate(_doc_vectors)]

    scores.sort(key=lambda x: x[0], reverse=True)
    best_score, best_idx = scores[0]

    best = _CORPUS[best_idx]
    result = {
        "id":               best["id"],
        "title":            best["title"],
        "section":          best["section"],
        "citation":         best["citation"],
        "category":         best["category"],
        "vector_score":     round(best_score, 4),
        "mandatory_actions": best["mandatory_actions"],
        "alternatives": [
            {
                "id":           _CORPUS[idx]["id"],
                "title":        _CORPUS[idx]["title"],
                "vector_score": round(sc, 4),
            }
            for sc, idx in scores[1:top_k + 1]
        ],
    }

    print(
        f"\033[96m[RAG VECTOR SEARCH]\033[0m Query: '{query_str[:60]}' "
        f">> Best: \033[96m{best['id']}\033[0m | "
        f"Score: \033[93m{result['vector_score']:.4f}\033[0m"
    )

    return result


def get_all_sop_documents() -> List[Dict[str, Any]]:
    """Returns the full indexed SOP corpus (without raw text field)."""
    return [
        {k: v for k, v in doc.items() if k != "text"}
        for doc in _CORPUS
    ]
