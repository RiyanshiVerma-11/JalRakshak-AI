.PHONY: help install test build demo sam-validate localstack-up localstack-down localstack-setup clean

help:
	@echo "JalRakshak AI - Automation Targets:"
	@echo "  make install          Install Python and Frontend dependencies"
	@echo "  make test             Run pytest suite (Integration + AWS Cedar RBAC)"
	@echo "  make build            Compile React frontend and build SAM artifacts"
	@echo "  make demo             Launch unified FastAPI server on http://localhost:8004"
	@echo "  make sam-validate     Validate AWS SAM Infrastructure Template"
	@echo "  make localstack-up    Start LocalStack container (docker-compose.local.yml)"
	@echo "  make localstack-setup Provision S3, DynamoDB, SNS, EventBridge in LocalStack"
	@echo "  make localstack-down  Stop LocalStack container"
	@echo "  make clean            Remove build artifacts and pytest caches"

install:
	pip install -r requirements.txt
	cd frontend && npm install

test:
	python -m pytest tests/ -v

build:
	cd frontend && npm run build
	sam validate --template aws_infra/template.yaml --region ap-south-1 --lint
	sam build --template aws_infra/template.yaml --region ap-south-1

demo:
	python run_app.py

sam-validate:
	sam validate --template aws_infra/template.yaml --region ap-south-1 --lint

localstack-up:
	docker compose -f docker-compose.local.yml up -d localstack

localstack-setup:
	python scripts/setup_localstack.py

localstack-down:
	docker compose -f docker-compose.local.yml down

clean:
	rm -rf .pytest_cache __pycache__ .aws-sam/build
	find . -name __pycache__ -type d -prune -exec rm -rf {} +
