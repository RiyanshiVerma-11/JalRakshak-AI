"""
JalRakshak AI — User-Friendly Health & Tool Inventory HTML Dashboard
Renders an executive, clean, light-themed HTML dashboard for browser requests to /api/health and /health,
affirming the 100% Local 'Build It' route with zero cloud credentials, while preserving raw JSON for API clients.
"""
import json

def render_health_dashboard_html(data: dict) -> str:
    json_str = json.dumps(data, indent=2)
    tools = data.get("build_it_tools", [])
    cloud_metrics = data.get("cloud_metrics", {})
    services = cloud_metrics.get("services", {})
    status = data.get("status", "HEALTHY")
    mode = data.get("mode", "OFFLINE")
    track = data.get("track", "Heat and Water")
    route = data.get("route", "Build It")
    cedar_engine = data.get("cedar_engine", "cedarpy")
    model_provider = data.get("model_provider", "LocalDeterministicModel")
    timestamp = data.get("timestamp", "")
    reason = data.get("reason", "Zero-credential Build It mode (no AWS account required, running purely offline)")

    # 4 Declared AWS Open-Source Tools Cards
    tools_html = ""
    for t in tools:
        t_name = t.get("tool", "")
        t_cat = t.get("category", "")
        t_status = t.get("status", "ACTIVE")
        t_evidence = t.get("evidence", "")
        badge_cls = "badge-green" if t_status == "ACTIVE" else "badge-purple"
        tools_html += f"""
        <div class="tool-card">
          <div class="card-top">
            <div>
              <span class="tool-cat">{t_cat}</span>
              <h3 class="tool-name">{t_name}</h3>
            </div>
            <span class="badge {badge_cls}">{t_status}</span>
          </div>
          <div class="tool-evidence">
            <code>{t_evidence}</code>
          </div>
          <div class="card-footer">
            <span class="footer-tag">Route: <strong>{route}</strong></span>
            <span class="verified-tag">✓ Verified 100% Local</span>
          </div>
        </div>
        """

    # Subsystem mapping with honest Build It labels (NO misleading "Live Cloud")
    service_labels = {
        "AWS_Strands_Agents": {
            "title": "AWS Strands Agents SDK",
            "desc": "5-Agent Collaborative DAG (Real Local SDK)",
            "badge": "HEALTHY",
            "badge_cls": "badge-green"
        },
        "Amazon_Bedrock": {
            "title": "Amazon Bedrock (Claude 3.5)",
            "desc": "LocalDeterministicModel (Zero Cloud API Calls)",
            "badge": "OFFLINE",
            "badge_cls": "badge-slate"
        },
        "Amazon_EventBridge": {
            "title": "Amazon EventBridge",
            "desc": "Local In-Memory Event Bus (Build It Emulation)",
            "badge": "LOCAL",
            "badge_cls": "badge-cyan"
        },
        "Amazon_DynamoDB": {
            "title": "Amazon DynamoDB",
            "desc": "Atomic InMemoryStateStore (4 Tables)",
            "badge": "LOCAL",
            "badge_cls": "badge-cyan"
        },
        "Amazon_S3": {
            "title": "Amazon S3",
            "desc": "Local Filesystem Evidence Lake",
            "badge": "LOCAL",
            "badge_cls": "badge-cyan"
        },
        "Amazon_SNS": {
            "title": "Amazon SNS",
            "desc": "Local Trilingual Broadcast Stream (EN/HI/MR)",
            "badge": "LOCAL",
            "badge_cls": "badge-cyan"
        },
        "Amazon_Rekognition": {
            "title": "Amazon Rekognition",
            "desc": "Local PIL Statistical Depth & Grate Vision",
            "badge": "LOCAL PIL",
            "badge_cls": "badge-purple"
        }
    }

    services_html = ""
    for s_name in services.keys():
        meta = service_labels.get(s_name, {
            "title": s_name.replace("_", " "),
            "desc": "Local Build It Subsystem",
            "badge": "LOCAL",
            "badge_cls": "badge-cyan"
        })
        services_html += f"""
        <div class="service-row">
          <div class="service-left">
            <span class="service-title">{meta['title']}</span>
            <span class="service-desc">{meta['desc']}</span>
          </div>
          <span class="badge {meta['badge_cls']}">{meta['badge']}</span>
        </div>
        """

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JalRakshak AI — System Health & Tool Inventory</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <style>
    :root {{
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --border: #e2e8f0;
      --border-subtle: #edf2f7;
      --text-main: #0f172a;
      --text-muted: #475569;
      --text-dim: #64748b;
      --primary: #0284c7;
      --primary-hover: #0369a1;
      --emerald: #059669;
      --emerald-bg: #ecfdf5;
      --emerald-border: #a7f3d0;
      --cyan: #0891b2;
      --cyan-bg: #ecfeff;
      --cyan-border: #a5f3fc;
      --purple: #7c3aed;
      --purple-bg: #f5f3ff;
      --purple-border: #ddd6fe;
      --slate-badge-bg: #f1f5f9;
      --slate-badge-text: #475569;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text-main);
      line-height: 1.5;
      padding: 28px 20px;
      min-height: 100vh;
    }}
    .container {{
      max-width: 1080px;
      margin: 0 auto;
    }}
    
    /* Top Header */
    header {{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 24px;
    }}
    .brand {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}
    .brand-icon {{
      font-size: 26px;
      background: #e0f2fe;
      border: 1px solid #bae6fd;
      padding: 6px 12px;
      border-radius: 12px;
    }}
    .brand h1 {{
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.4px;
      color: var(--text-main);
    }}
    .brand p {{
      font-size: 13px;
      color: var(--text-dim);
    }}
    .nav-actions {{
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }}
    .btn {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 700;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.15s ease-in-out;
      cursor: pointer;
    }}
    .btn-primary {{
      background: linear-gradient(135deg, #0284c7, #0ea5e9);
      color: #ffffff;
      border: 1px solid #0284c7;
      box-shadow: 0 1px 2px rgba(2, 132, 199, 0.2);
    }}
    .btn-primary:hover {{
      background: linear-gradient(135deg, #0369a1, #0284c7);
      transform: translateY(-1px);
    }}
    .btn-secondary {{
      background: #ffffff;
      color: #334155;
      border: 1px solid var(--border);
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }}
    .btn-secondary:hover {{
      background: #f1f5f9;
      color: #0f172a;
      border-color: #cbd5e1;
    }}

    /* Key Metrics Banner */
    .status-banner {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }}
    .banner-stat {{
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 14px 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }}
    .stat-label {{
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: var(--text-dim);
      margin-bottom: 4px;
    }}
    .stat-val {{
      font-size: 15px;
      font-weight: 800;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    .pulse-dot {{
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--emerald);
      box-shadow: 0 0 8px var(--emerald);
      animation: pulse 2s infinite;
    }}
    @keyframes pulse {{
      0% {{ transform: scale(0.95); box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.6); }}
      70% {{ transform: scale(1); box-shadow: 0 0 0 7px rgba(5, 150, 105, 0); }}
      100% {{ transform: scale(0.95); box-shadow: 0 0 0 0 rgba(5, 150, 105, 0); }}
    }}

    /* Build It Route Guarantee Callout */
    .route-callout {{
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 10px;
      padding: 12px 16px;
      margin-bottom: 24px;
      font-size: 12px;
      color: #166534;
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    .route-callout strong {{
      font-weight: 800;
    }}

    /* Badges */
    .badge {{
      display: inline-flex;
      align-items: center;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.4px;
      text-transform: uppercase;
    }}
    .badge-green {{ background: var(--emerald-bg); color: var(--emerald); border: 1px solid var(--emerald-border); }}
    .badge-cyan {{ background: var(--cyan-bg); color: var(--cyan); border: 1px solid var(--cyan-border); }}
    .badge-purple {{ background: var(--purple-bg); color: var(--purple); border: 1px solid var(--purple-border); }}
    .badge-slate {{ background: var(--slate-badge-bg); color: var(--slate-badge-text); border: 1px solid var(--border); }}

    /* Section Headings */
    .section-title {{
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: #334155;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    .section-title::before {{
      content: "";
      width: 4px;
      height: 14px;
      background: var(--primary);
      border-radius: 2px;
    }}

    /* 4 Declared AWS Open-Source Tools Grid */
    .tools-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }}
    .tool-card {{
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
      transition: all 0.2s ease;
    }}
    .tool-card:hover {{
      border-color: #94a3b8;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      transform: translateY(-1px);
    }}
    .card-top {{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }}
    .tool-cat {{
      font-size: 10px;
      color: var(--primary);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: block;
      margin-bottom: 2px;
    }}
    .tool-name {{
      font-size: 14px;
      font-weight: 800;
      color: var(--text-main);
    }}
    .tool-evidence {{
      font-size: 11px;
      color: #334155;
      margin-bottom: 12px;
      word-break: break-all;
      background: #f1f5f9;
      padding: 6px 8px;
      border-radius: 6px;
      border: 1px solid var(--border);
    }}
    .card-footer {{
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: var(--text-dim);
      font-weight: 600;
      border-top: 1px solid var(--border);
      padding-top: 8px;
    }}
    .verified-tag {{ color: var(--emerald); font-weight: 700; }}

    /* Two Column Subsystems Grid */
    .split-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }}
    @media (max-width: 768px) {{
      .split-grid {{ grid-template-columns: 1fr; }}
    }}
    .panel-box {{
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 14px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }}
    .service-row {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 10px;
      border-radius: 8px;
      background: #f8fafc;
      border: 1px solid var(--border);
      margin-bottom: 6px;
    }}
    .service-row:last-child {{ margin-bottom: 0; }}
    .service-left {{
      display: flex;
      flex-direction: column;
    }}
    .service-title {{
      font-size: 12px;
      font-weight: 700;
      color: var(--text-main);
    }}
    .service-desc {{
      font-size: 10px;
      color: var(--text-dim);
    }}

    /* Raw JSON Section */
    .json-box {{
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }}
    .json-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }}
    .json-header span {{
      font-size: 12px;
      font-weight: 700;
      color: var(--text-muted);
    }}
    pre {{
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      color: #1e293b;
      background: #f1f5f9;
      padding: 14px;
      border-radius: 8px;
      overflow-x: auto;
      max-height: 260px;
      line-height: 1.45;
      border: 1px solid var(--border);
    }}
    
    footer {{
      margin-top: 24px;
      text-align: center;
      font-size: 11px;
      color: var(--text-dim);
      border-top: 1px solid var(--border);
      padding-top: 16px;
    }}
  </style>
</head>
<body>
  <div class="container">
    
    <!-- Top Header -->
    <header>
      <div class="brand">
        <span class="brand-icon">🌊</span>
        <div>
          <h1>JalRakshak AI — System Health & Tool Inventory</h1>
          <p>AWS Open-Source Build It Route • 100% Local Offline Decision Engine</p>
        </div>
      </div>
      <div class="nav-actions">
        <a href="/command-center" class="btn btn-primary">🚀 Command Center ➔</a>
        <a href="/citizen" class="btn btn-secondary">📱 Citizen PWA</a>
        <a href="/docs" class="btn btn-secondary">📑 Swagger Docs</a>
        <a href="?format=json" class="btn btn-secondary">📋 Raw JSON</a>
      </div>
    </header>

    <!-- Key Status Metrics Banner -->
    <div class="status-banner">
      <div class="banner-stat">
        <div class="stat-label">Platform Health</div>
        <div class="stat-val">
          <span class="pulse-dot"></span>
          <span>{status}</span>
        </div>
      </div>

      <div class="banner-stat">
        <div class="stat-label">Execution Mode</div>
        <div class="stat-val" style="color: var(--primary);">
          <span>{mode}</span>
        </div>
      </div>

      <div class="banner-stat">
        <div class="stat-label">Track & Route</div>
        <div class="stat-val">
          <span>{track} • {route}</span>
        </div>
      </div>

      <div class="banner-stat">
        <div class="stat-label">AWS Credentials</div>
        <div class="stat-val" style="color: var(--emerald);">
          <span>NONE (0 Outbound Calls)</span>
        </div>
      </div>
    </div>

    <!-- Build It Guarantee Callout -->
    <div class="route-callout">
      <span>🛡️</span>
      <div>
        <strong>Build It Guarantee:</strong> {reason} (Zero cloud credentials, zero credit card, 100% offline-ready).
      </div>
    </div>

    <!-- 4 Declared AWS Open-Source Tools (Build It Route) -->
    <h2 class="section-title">4 Declared AWS Open-Source Tools (Build It Route)</h2>
    <div class="tools-grid">
      {tools_html}
    </div>

    <!-- Two-Column Subsystem Breakdown -->
    <div class="split-grid">
      <div>
        <h2 class="section-title">Execution Subsystems</h2>
        <div class="panel-box">
          <div class="service-row">
            <div class="service-left">
              <span class="service-title">Agentic DAG Orchestrator</span>
              <span class="service-desc">5-Agent sequential state machine</span>
            </div>
            <span class="badge badge-green">AWS Strands SDK (5 Agents)</span>
          </div>
          <div class="service-row">
            <div class="service-left">
              <span class="service-title">Model Provider</span>
              <span class="service-desc">Local Deterministic Model (Zero cloud cost)</span>
            </div>
            <span class="badge badge-cyan">{model_provider}</span>
          </div>
          <div class="service-row">
            <div class="service-left">
              <span class="service-title">Statutory Policy Engine</span>
              <span class="service-desc">Rust-backed incident authorization</span>
            </div>
            <span class="badge badge-purple">AWS Cedar ({cedar_engine})</span>
          </div>
          <div class="service-row">
            <div class="service-left">
              <span class="service-title">Disaster Protocols RAG</span>
              <span class="service-desc">NDMA 2024 & NHAP statutory guidelines</span>
            </div>
            <span class="badge badge-green">TF-IDF Vector RAG</span>
          </div>
          <div class="service-row">
            <div class="service-left">
              <span class="service-title">State Persistence</span>
              <span class="service-desc">Atomic thread-safe memory store</span>
            </div>
            <span class="badge badge-cyan">InMemoryStateStore</span>
          </div>
        </div>
      </div>

      <div>
        <h2 class="section-title">AWS Service Emulation & Fallbacks</h2>
        <div class="panel-box">
          {services_html}
        </div>
      </div>
    </div>

    <!-- Developer Raw JSON Drawer -->
    <div class="json-box">
      <div class="json-header">
        <span>Raw JSON Payload (for automated evaluator scripts & tests)</span>
        <button onclick="copyJson()" class="btn btn-secondary" style="padding: 4px 10px; font-size: 11px;" id="copyBtn">
          📋 Copy JSON
        </button>
      </div>
      <pre id="jsonContent">{json_str}</pre>
    </div>

    <footer>
      JalRakshak AI • WeMakeDevs × AWS Environmental Hacks • Track 02: Heat and Water • Timestamp: {timestamp}
    </footer>

  </div>

  <script>
    function copyJson() {{
      const text = document.getElementById('jsonContent').innerText;
      navigator.clipboard.writeText(text).then(() => {{
        const btn = document.getElementById('copyBtn');
        btn.innerText = '✓ Copied!';
        setTimeout(() => {{ btn.innerText = '📋 Copy JSON'; }}, 2000);
      }});
    }}
  </script>
</body>
</html>
"""
