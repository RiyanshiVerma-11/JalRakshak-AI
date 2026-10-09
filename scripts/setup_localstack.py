#!/usr/bin/env python3
"""
JalRakshak AI — 1-Click LocalStack Provisioning & Live Verification Script
Author: JalRakshak AI Team
Purpose:
  Provisions all required AWS cloud emulation resources against LocalStack
  (DynamoDB, EventBridge, SNS, S3) and verifies live Boto3 SDK connectivity.

Usage:
  python scripts/setup_localstack.py
"""

import os
import sys
import time

try:
    import boto3
    from botocore.exceptions import ClientError, EndpointConnectionError
except ImportError:
    print("\n[ERROR] boto3 is not installed. Run: pip install boto3")
    sys.exit(1)

ENDPOINT_URL = os.environ.get("AWS_ENDPOINT_URL", "http://localhost:4566")
REGION = os.environ.get("AWS_DEFAULT_REGION", "ap-south-1")

G = "\033[92m"; Y = "\033[93m"; C = "\033[96m"; R = "\033[0m"; B = "\033[1m"; RED = "\033[91m"

def step_header(title):
    print(f"\n{B}{C}=== {title} ==={R}")

def check_connection():
    step_header(f"1. Checking LocalStack Gateway Connection ({ENDPOINT_URL})")
    s3 = boto3.client("s3", endpoint_url=ENDPOINT_URL, region_name=REGION,
                      aws_access_key_id="test", aws_secret_access_key="test")
    try:
        s3.list_buckets()
        print(f"{G}✓ Connected to LocalStack gateway at {ENDPOINT_URL}{R}")
        return True
    except EndpointConnectionError:
        print(f"{RED}✗ Could not connect to LocalStack at {ENDPOINT_URL}.{R}")
        print(f"  Make sure LocalStack is running: {B}docker compose -f docker-compose.local.yml up -d localstack{R}")
        return False
    except Exception as e:
        print(f"{Y}! LocalStack responding with notice: {e}{R}")
        return True

def provision_s3():
    step_header("2. Provisioning S3 Evidence Lake")
    s3 = boto3.client("s3", endpoint_url=ENDPOINT_URL, region_name=REGION,
                      aws_access_key_id="test", aws_secret_access_key="test")
    bucket_name = "jalrakshak-evidence-lake"
    try:
        s3.create_bucket(
            Bucket=bucket_name,
            CreateBucketConfiguration={"LocationConstraint": REGION} if REGION != "us-east-1" else {}
        )
        print(f"{G}✓ Created S3 Bucket: {bucket_name}{R}")
    except ClientError as e:
        if "BucketAlreadyOwnedByYou" in str(e) or "BucketAlreadyExists" in str(e):
            print(f"{G}✓ Bucket already exists: {bucket_name}{R}")
        else:
            print(f"{Y}! S3 Notice: {e}{R}")

def provision_dynamodb():
    step_header("3. Provisioning DynamoDB Tables")
    client = boto3.client("dynamodb", endpoint_url=ENDPOINT_URL, region_name=REGION,
                          aws_access_key_id="test", aws_secret_access_key="test")

    tables_spec = [
        {
            "TableName": "JalRakshak-IncidentsTable",
            "KeySchema": [{"AttributeName": "id", "KeyType": "HASH"}],
            "AttributeDefinitions": [
                {"AttributeName": "id", "AttributeType": "S"},
                {"AttributeName": "severity", "AttributeType": "S"}
            ],
            "GlobalSecondaryIndexes": [{
                "IndexName": "SeverityIndex",
                "KeySchema": [{"AttributeName": "severity", "KeyType": "HASH"}],
                "Projection": {"ProjectionType": "ALL"}
            }]
        },
        {
            "TableName": "JalRakshak-ResourcesTable",
            "KeySchema": [{"AttributeName": "id", "KeyType": "HASH"}],
            "AttributeDefinitions": [{"AttributeName": "id", "AttributeType": "S"}]
        },
        {
            "TableName": "JalRakshak-CitizenReportsTable",
            "KeySchema": [{"AttributeName": "id", "KeyType": "HASH"}],
            "AttributeDefinitions": [{"AttributeName": "id", "AttributeType": "S"}]
        },
        {
            "TableName": "JalRakshak-AuditLogTable",
            "KeySchema": [
                {"AttributeName": "incident_id", "KeyType": "HASH"},
                {"AttributeName": "timestamp", "KeyType": "RANGE"}
            ],
            "AttributeDefinitions": [
                {"AttributeName": "incident_id", "AttributeType": "S"},
                {"AttributeName": "timestamp", "AttributeType": "S"}
            ]
        }
    ]

    for spec in tables_spec:
        table_name = spec["TableName"]
        try:
            kwargs = {
                "TableName": table_name,
                "KeySchema": spec["KeySchema"],
                "AttributeDefinitions": spec["AttributeDefinitions"],
                "BillingMode": "PAY_PER_REQUEST"
            }
            if "GlobalSecondaryIndexes" in spec:
                kwargs["GlobalSecondaryIndexes"] = spec["GlobalSecondaryIndexes"]
            client.create_table(**kwargs)
            print(f"{G}✓ Created DynamoDB Table: {table_name}{R}")
        except ClientError as e:
            if "ResourceInUseException" in str(e):
                print(f"{G}✓ Table already exists: {table_name}{R}")
            else:
                print(f"{Y}! DynamoDB Notice ({table_name}): {e}{R}")

def provision_sns_and_events():
    step_header("4. Provisioning SNS & EventBridge")
    sns = boto3.client("sns", endpoint_url=ENDPOINT_URL, region_name=REGION,
                       aws_access_key_id="test", aws_secret_access_key="test")
    events = boto3.client("events", endpoint_url=ENDPOINT_URL, region_name=REGION,
                          aws_access_key_id="test", aws_secret_access_key="test")

    try:
        topic_res = sns.create_topic(Name="JalRakshak-Alerts-Multilingual")
        topic_arn = topic_res.get("TopicArn", "arn:aws:sns:ap-south-1:000000000000:JalRakshak-Alerts-Multilingual")
        print(f"{G}✓ Created SNS Topic: {topic_arn}{R}")
    except Exception as e:
        print(f"{Y}! SNS Notice: {e}{R}")

    try:
        events.create_event_bus(Name="jalrakshak-emergency-eventbus")
        print(f"{G}✓ Created EventBridge Bus: jalrakshak-emergency-eventbus{R}")
    except Exception as e:
        print(f"{Y}! EventBridge Notice: {e}{R}")

def main():
    print(f"\n{B}==================================================================={R}")
    print(f"{B}⚡ JalRakshak AI — LocalStack Setup & Verification{R}")
    print(f"{B}==================================================================={R}")

    if not check_connection():
        sys.exit(1)

    provision_s3()
    provision_dynamodb()
    provision_sns_and_events()

    print(f"\n{B}{G}==================================================================={R}")
    print(f"{B}{G}🎉 LocalStack Environment Ready!{R}")
    print(f"To run JalRakshak AI against LocalStack:")
    print(f"  {B}export AWS_ENDPOINT_URL=http://localhost:4566{R}")
    print(f"  {B}export AWS_EXECUTION_MODE=LOCALSTACK{R}")
    print(f"  {B}python run_app.py{R}")
    print(f"{B}{G}==================================================================={R}\n")

if __name__ == "__main__":
    main()
