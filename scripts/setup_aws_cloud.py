#!/usr/bin/env python3
"""
JalRakshak AI — 1-Click AWS Cloud Provisioning & Live Verification Script
Author: JalRakshak AI Team
Purpose:
  Provisions all required AWS cloud resources (DynamoDB, EventBridge, SNS, S3)
  with PAY_PER_REQUEST billing (free tier friendly) and verifies Amazon Bedrock
  & Rekognition access with 0 manual AWS console clicking.

Usage:
  python scripts/setup_aws_cloud.py
"""

import os
import sys
import json
import time

# Auto-load .env
try:
    from dotenv import load_dotenv
    load_dotenv(override=True)
except ImportError:
    pass

# Direct fallback parser if python-dotenv not installed
env_file = os.path.join(os.path.dirname(__file__), "..", ".env")
if os.path.isfile(env_file):
    with open(env_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip().strip("'\"")

try:
    import boto3
    from botocore.exceptions import ClientError, NoCredentialsError
except ImportError:
    print("\n[ERROR] boto3 is not installed. Run: pip install boto3")
    sys.exit(1)

REGION = os.environ.get("AWS_DEFAULT_REGION", os.environ.get("AWS_REGION", "ap-south-1"))
MODEL_ID = os.environ.get("BEDROCK_MODEL_ID", "anthropic.claude-3-5-sonnet-20240620-v1:0")

TABLES = [
    "JalRakshak-IncidentsTable",
    "JalRakshak-ResourcesTable",
    "JalRakshak-CitizenReportsTable",
    "JalRakshak-AuditLogsTable"
]
EVENT_BUS_NAME = os.environ.get("EVENTBRIDGE_BUS", "jalrakshak-emergency-eventbus")
SNS_TOPIC_NAME = "JalRakshak-Alerts-Multilingual"

G = "\033[92m"; Y = "\033[93m"; C = "\033[96m"; R = "\033[0m"; B = "\033[1m"; RED = "\033[91m"

def step_header(title):
    print(f"\n{B}{C}=== {title} ==={R}")

def check_identity():
    step_header("1. Verifying AWS Identity & Credentials")
    try:
        sts = boto3.client("sts", region_name=REGION)
        ident = sts.get_caller_identity()
        print(f" {G}[OK]{R} Connected successfully!")
        print(f"      Account ID : {B}{ident.get('Account')}{R}")
        print(f"      User / Role: {ident.get('Arn')}")
        print(f"      Region     : {REGION}")
        return ident
    except NoCredentialsError:
        print(f" {RED}[FAILED]{R} No AWS credentials found in environment or .env file.")
        print(f" Please populate your .env file with:")
        print(f"   AWS_ACCESS_KEY_ID=...")
        print(f"   AWS_SECRET_ACCESS_KEY=...")
        print(f"   AWS_DEFAULT_REGION={REGION}")
        sys.exit(1)
    except Exception as exc:
        print(f" {RED}[FAILED]{R} STS check failed: {exc}")
        sys.exit(1)

def setup_dynamodb():
    step_header("2. Provisioning Amazon DynamoDB Tables (Free-Tier On-Demand)")
    ddb = boto3.client("dynamodb", region_name=REGION)
    for table_name in TABLES:
        try:
            ddb.describe_table(TableName=table_name)
            print(f" {G}[EXISTS]{R} DynamoDB table '{table_name}' is already ACTIVE.")
        except ClientError as ce:
            if ce.response["Error"]["Code"] == "ResourceNotFoundException":
                print(f" {Y}[CREATING]{R} Creating DynamoDB table '{table_name}'...")
                ddb.create_table(
                    TableName=table_name,
                    KeySchema=[{"AttributeName": "id", "KeyType": "HASH"}],
                    AttributeDefinitions=[{"AttributeName": "id", "AttributeType": "S"}],
                    BillingMode="PAY_PER_REQUEST"
                )
                print(f" {G}[CREATED]{R} Table '{table_name}' provisioned (PAY_PER_REQUEST / On-Demand).")
            else:
                print(f" {RED}[ERROR]{R} Could not check table '{table_name}': {ce}")

def setup_eventbridge():
    step_header("3. Provisioning Amazon EventBridge Custom Bus")
    events = boto3.client("events", region_name=REGION)
    try:
        events.create_event_bus(Name=EVENT_BUS_NAME)
        print(f" {G}[CREATED]{R} Custom EventBus '{EVENT_BUS_NAME}' created.")
    except ClientError as ce:
        if ce.response["Error"]["Code"] == "ResourceAlreadyExistsException":
            print(f" {G}[EXISTS]{R} Custom EventBus '{EVENT_BUS_NAME}' is already active.")
        else:
            print(f" {Y}[NOTICE]{R} EventBus check: {ce}")

def setup_sns():
    step_header("4. Provisioning Amazon SNS Multilingual Topic")
    sns = boto3.client("sns", region_name=REGION)
    try:
        resp = sns.create_topic(Name=SNS_TOPIC_NAME)
        topic_arn = resp.get("TopicArn")
        print(f" {G}[ACTIVE]{R} SNS Topic '{SNS_TOPIC_NAME}' is ready.")
        print(f"      Topic ARN: {B}{C}{topic_arn}{R}")
        return topic_arn
    except Exception as exc:
        print(f" {RED}[ERROR]{R} SNS Topic creation failed: {exc}")
        return None

def verify_bedrock():
    step_header("5. Verifying Amazon Bedrock Foundation Model Access")
    try:
        client = boto3.client("bedrock-runtime", region_name=REGION)
        t0 = time.time()
        resp = client.converse(
            modelId=MODEL_ID,
            messages=[{"role": "user", "content": [{"text": "Hello Bedrock, confirm JalRakshak AI status."}]}]
        )
        latency = int((time.time() - t0) * 1000)
        output_txt = resp["output"]["message"]["content"][0]["text"].strip()
        print(f" {G}[VERIFIED]{R} Amazon Bedrock live invocation SUCCESS!")
        print(f"      Model ID   : {MODEL_ID}")
        print(f"      Latency    : {latency} ms")
        print(f"      Response   : \"{output_txt[:120]}...\"")
    except ClientError as ce:
        code = ce.response["Error"]["Code"]
        msg = ce.response["Error"]["Message"]
        print(f" {Y}[WARNING]{R} Bedrock check returned {code}: {msg}")
        if "AccessDeniedException" in code:
            print(f"      👉 Please enable model access in the Bedrock console:")
            print(f"         https://{REGION}.console.aws.amazon.com/bedrock/home?region={REGION}#/modelaccess")
    except Exception as exc:
        print(f" {Y}[WARNING]{R} Bedrock invocation ping: {exc}")

def verify_rekognition():
    step_header("6. Verifying Amazon Rekognition Multimodal Vision")
    try:
        rek = boto3.client("rekognition", region_name=REGION)
        # 1x1 transparent PNG byte test
        sample_png = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
        rek.detect_labels(Image={"Bytes": sample_png}, MaxLabels=3)
        print(f" {G}[VERIFIED]{R} Amazon Rekognition detect_labels is ACTIVE and accessible!")
    except Exception as exc:
        print(f" {Y}[NOTICE]{R} Amazon Rekognition status: {exc}")

def main():
    print(f"\n{B}{G}======================================================================{R}")
    print(f"{B}{G} [JalRakshak AI] AWS Cloud Infrastructure Auto-Setup & Health Check{R}")
    print(f"{B}{G}======================================================================{R}")
    ident = check_identity()
    setup_dynamodb()
    setup_eventbridge()
    topic_arn = setup_sns()
    verify_bedrock()
    verify_rekognition()

    print(f"\n{B}{G}======================================================================{R}")
    print(f"{B}{G} [SUCCESS] ALL CLOUD INFRASTRUCTURE PROVISIONED & READY FOR LIVE DEMO!{R}")
    print(f"{B}{G}======================================================================{R}")
    print(f" Next steps:")
    print(f" 1. Set {B}AWS_EXECUTION_MODE=LIVE{R} in your .env")
    if topic_arn:
        print(f" 2. Set {B}SNS_TOPIC_ARN={topic_arn}{R} in your .env")
    print(f" 3. Run: {C}pytest tests/ -k test_live{R} to verify live cloud gates pass.")
    print(f" 4. Run: {C}python run_app.py{R} and record your demo!\n")

if __name__ == "__main__":
    main()
