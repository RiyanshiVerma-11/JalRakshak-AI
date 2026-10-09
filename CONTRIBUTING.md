# Contributing to JalRakshak AI

Thank you for your interest in contributing to JalRakshak AI! This project is an open-source, protocol-grounded decision-support platform for municipal flood and heatwave crisis response.

## 1. Development Principles
1. **Build It Route Compliance:** The default runtime must always execute 100% locally with zero cloud account or `.env` configuration requirements.
2. **Statutory Protocol Grounding:** All AI recommendations must cite official government SOPs (NDMA 2024, NHAP, CPHEEO, JJM).
3. **Engineering Honesty:** Never mock or fabricate AWS SDK responses with synthetic success IDs. Always declare `simulated: true` on offline fallbacks.
4. **Reproducible Benchmarks:** All performance numbers quoted in documentation must be generated via reproducible commands.

## 2. Local Setup
```bash
# 1. Clone repository
git clone https://github.com/RiyanshiVerma-11/JalRakshak-AI.git
cd JalRakshak-AI

# 2. Create virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# 3. Install locked dependencies
pip install -r requirements.lock

# 4. Run tests
python -m pytest tests/ -v
```

## 3. Pull Request Guidelines
- Ensure all tests pass: `python -m pytest tests/ -q`
- Run the benchmark to verify no latency regression: `python tests/benchmark_strands.py 100`
- Maintain least-privilege IAM policies if modifying `aws_infra/template.yaml`.
- Sign your commits and write descriptive commit messages.
