#!/bin/bash
# =============================================================================
# JalRakshak AI — LocalStack Automated Initialization Script
# Automatically mounted to /etc/localstack/init/ready.d/init-aws.sh
# Provisions S3, DynamoDB, SNS, and EventBridge on container startup
# =============================================================================
set -e

echo "=========================================================="
echo "⚡ JalRakshak AI: Provisioning LocalStack (ap-south-1)..."
echo "=========================================================="

export AWS_DEFAULT_REGION=ap-south-1

# 1. S3 Evidence Lake Bucket
echo "📦 [1/4] Creating Amazon S3 Evidence Lake..."
awslocal s3 mb s3://jalrakshak-evidence-lake || true

# 2. DynamoDB Tables
echo "🗄️ [2/4] Creating Amazon DynamoDB Tables..."
awslocal dynamodb create-table \
  --table-name JalRakshak-IncidentsTable \
  --attribute-definitions AttributeName=id,AttributeType=S AttributeName=severity,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes '[{"IndexName":"SeverityIndex","KeySchema":[{"AttributeName":"severity","KeyType":"HASH"}],"Projection":{"ProjectionType":"ALL"}}]' \
  --billing-mode PAY_PER_REQUEST || true

awslocal dynamodb create-table \
  --table-name JalRakshak-ResourcesTable \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST || true

awslocal dynamodb create-table \
  --table-name JalRakshak-CitizenReportsTable \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST || true

awslocal dynamodb create-table \
  --table-name JalRakshak-AuditLogTable \
  --attribute-definitions AttributeName=incident_id,AttributeType=S AttributeName=timestamp,AttributeType=S \
  --key-schema AttributeName=incident_id,KeyType=HASH AttributeName=timestamp,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST || true

# 3. SNS Emergency Alerts Multilingual Topic
echo "📢 [3/4] Creating Amazon SNS Multilingual Topic..."
awslocal sns create-topic --name JalRakshak-Alerts-Multilingual || true

# 4. EventBridge Emergency Event Bus
echo "⚡ [4/4] Creating Amazon EventBridge Emergency Bus..."
awslocal events create-event-bus --name jalrakshak-emergency-eventbus || true

echo "=========================================================="
echo "✅ JalRakshak AI LocalStack Provisioning Complete!"
echo "=========================================================="
