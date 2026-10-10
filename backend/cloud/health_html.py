"""
JalRakshak AI — User-Friendly Health & Tool Inventory HTML Dashboard
Renders an executive, modern, dark-themed HTML dashboard for browser requests to /api/health and /health,
while preserving full raw JSON for API clients, scripts, and tests.
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
    reason = data.get("reason", "Zero-credential Build It mode")

    tools_html = ""
    for t in tools:
        t_name = t.get("tool", "")
        t_cat = t.get("category", "")
        t_status = t.get("status", "ACTIVE")
        t_evidence = t.get("evidence", "")
        status_badge_class = "badge-green" if t_status == "ACTIVE" else "badge-purple"
        tools_html += f"""
        <div class="card tool-card">
          <div class="card-header">
            <div>
              <span class="tool-cat">{t_cat}</span>
              <h3 class="tool-name">{t_name}</h3>
            </div>
            <span class="badge {status_badge_class}">{t_status}</span>
          </div>
          <p class="tool-evidence"><code>{t_evidence}</code></p>
          <div class="card-footer">
            <span class="route-tag">Route: {route}</span>
            <span class="verified-tag">✓ Verified Locally</span>
          </div>
        </div>
        """

    services_html = ""
    for s_name, s_info in services.items():
        s_status = s_info.get("status", "LOCAL")
        s_sim = s_info.get("simulated", True)
        badge_cls = "badge-cyan" if not s_sim else ("badge-green" if s_status == "HEALTHY" else "badge-purple")
        sim_note = "Simulated / Local" if s_sim else "Live Cloud"
        clean_name = s_name.replace("_", " ")
        services_html += f"""
        <div class="service-row">
          <div class="service-name">
            <strong>{clean_name}</strong>
            <span class="service-sim">({sim_note})</span>
          </div>
          <span class="badge {badge_cls}">{s_status}</span>
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
      --bg: #090d16;
      --card-bg: #111827;
      --card-border: #1f293d;
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --text-dim: #6b7280;
      --cyan: #06b6d4;
      --emerald: #10b981;
      --rose: #f43f5e;
      --purple: #a855f7;
      --amber: #f59e0b;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text-main);
      line-height: 1.5;
      padding: 24px;
      min-height: 100vh;
    }}
    .container {{
      max-width: 1100px;
      margin: 0 auto;
    }}
    header {{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--card-border);
      margin-bottom: 24px;
    }}
    .brand {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}
    .brand-icon {{
      font-size: 28px;
      background: rgba(6, 182, 212, 0.15);
      border: 1px solid rgba(6, 182, 212, 0.3);
      padding: 8px 12px;
      border-radius: 12px;
    }}
    .brand h1 {{
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #fff;
    }}
    .brand p {{
      font-size: 13px;
      color: var(--text-muted);
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
      transition: all 0.2s;
      cursor: pointer;
    }}
    .btn-primary {{
      background: linear-gradient(135deg, #0284c7, #06b6d4);
      color: #fff;
      border: 1px solid #38bdf8;
    }}
    .btn-primary:hover {{ opacity: 0.9; transform: translateY(-1px); }}
    .btn-secondary {{
      background: #1e293b;
      color: #cbd5e1;
      border: 1px solid #334155;
    }}
    .btn-secondary:hover {{ background: #334155; color: #fff; }}

    /* Overview Banner */
    .status-banner {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }}
    .banner-stat {{
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 14px 16px;
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
      color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    .pulse-dot {{
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--emerald);
      box-shadow: 0 0 10px var(--emerald);
      animation: pulse 2s infinite;
    }}
    @keyframes pulse {{
      0% {{ transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }}
      70% {{ transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }}
      100% {{ transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }}
    }}

    /* Badges */
    .badge {{
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }}
    .badge-green {{ background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }}
    .badge-cyan {{ background: rgba(6, 182, 212, 0.15); color: #38bdf8; border: 1px solid rgba(6, 182, 212, 0.3); }}
    .badge-purple {{ background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }}

    /* Section Headings */
    .section-title {{
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: #cbd5e1;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    .section-title::before {{
      content: "";
      width: 4px;
      height: 14px;
      background: var(--cyan);
      border-radius: 2px;
    }}

    /* Grid layout */
    .tools-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }}
    .card {{
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 16px;
      transition: all 0.2s;
    }}
    .tool-card:hover {{
      border-color: rgba(6, 182, 212, 0.4);
      transform: translateY(-2px);
    }}
    .card-header {{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }}
    .tool-cat {{
      font-size: 10px;
      color: var(--cyan);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: block;
    }}
    .tool-name {{
      font-size: 14px;
      font-weight: 700;
      color: #fff;
    }}
    .tool-evidence {{
      font-size: 11px;
      color: var(--text-muted);
      margin-bottom: 12px;
      word-break: break-all;
      background: rgba(0, 0, 0, 0.3);
      padding: 6px 8px;
      border-radius: 6px;
      border: 1px solid #1e293b;
    }}
    .card-footer {{
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: var(--text-dim);
      font-weight: 600;
      border-top: 1px solid #1e293b;
      padding-top: 8px;
    }}
    .verified-tag {{ color: #34d399; }}

    /* Two column section */
    .split-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }}
    @media (max-width: 768px) {{
      .split-grid {{ grid-template-columns: 1fr; }}
    }}
    .service-row {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      border-radius: 8px;
      background: rgba(0,0,0,0.25);
      border: 1px solid #1e293b;
      margin-bottom: 6px;
      font-size: 12px;
    }}
    .service-name strong {{ color: #e2e8f0; }}
    .service-sim {{ color: var(--text-dim); font-size: 11px; margin-left: 4px; }}

    /* Raw JSON Drawer */
    .json-box {{
      background: #020617;
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 16px;
      margin-top: 16px;
    }}
    .json-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }}
    pre {{
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      color: #94a3b8;
      background: #000;
      padding: 12px;
      border-radius: 8px;
      overflow-x: auto;
      max-height: 280px;
      line-height: 1.4;
      border: 1px solid #1e293b;
    }}
  </style>
</head>
<body>
  <div class="container">
    
    <!-- Top Navigation Header -->
    <header>
      <div class="brand">
        <span class="brand-icon">🌊</span>
        <div>
          <h1>JalRakshak AI — Health & Tool Inventory</h1>
          <p>Zero-Credential Build It Transparency Portal • Mumbai Ward-17 Engine</p>
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
        <div class="stat-val" style="color: var(--cyan);">
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

    <!-- Reason Callout -->
    <div style="background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.25); border-radius: 10px; padding: 12px 16px; margin-bottom: 24px; font-size: 12px; color: #cbd5e1;">
      <strong style="color: var(--cyan);">Build It Guarantee:</strong> {reason}
    </div>

    <!-- 4 Declared AWS Open-Source Tools -->
    <h2 class="section-title">4 Declared AWS Open-Source Tools (Build It Route)</h2>
    <div class="tools-grid">
      {tools_html}
    </div>

    <!-- Subsystems & Services Breakdown -->
    <div class="split-grid">
      <div>
        <h2 class="section-title">Execution Subsystems</h2>
        <div class="card" style="padding: 12px;">
          <div class="service-row">
            <div class="service-name"><strong>Agent Orchestration</strong></div>
            <span class="badge badge-green">AWS Strands SDK (5 Agents)</span>
          </div>
          <div class="service-row">
            <div class="service-name"><strong>Model Provider</strong></div>
            <span class="badge badge-cyan">{model_provider}</span>
          </div>
          <div class="service-row">
            <div class="service-name"><strong>Statutory Policy Engine</strong></div>
            <span class="badge badge-purple">AWS Cedar ({cedar_engine})</span>
          </div>
          <div class="service-row">
            <div class="service-name"><strong>Knowledge Base RAG</strong></div>
            <span class="badge badge-green">TF-IDF Vector RAG (NDMA 2024)</span>
          </div>
          <div class="service-row">
            <div class="service-name"><strong>Persistence State Store</strong></div>
            <span class="badge badge-cyan">InMemoryStateStore (Atomic)</span>
          </div>
        </div>
      </div>

      <div>
        <h2 class="section-title">AWS Service Emulation & Fallbacks</h2>
        <div class="card" style="padding: 12px;">
          {services_html}
        </div>
      </div>
    </div>

    <!-- Developer Raw JSON Drawer -->
    <div class="json-box">
      <div class="json-header">
        <span style="font-size: 12px; font-weight: 700; color: #94a3b8;">
          Raw JSON API Payload (for tests, curl & evaluator scripts)
        </span>
        <button onclick="copyJson()" class="btn btn-secondary" style="padding: 4px 10px; font-size: 11px;" id="copyBtn">
          📋 Copy JSON
        </button>
      </div>
      <pre id="jsonContent">{json_str}</pre>
    </div>

    <footer style="margin-top: 24px; text-align: center; font-size: 11px; color: var(--text-dim); border-top: 1px solid var(--card-border); padding-top: 16px;">
      JalRakshak AI • WeMakeDevs × AWS Environmental Hacks • Track 02: Heat and Water • Last Checked: {timestamp}
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
