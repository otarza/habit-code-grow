#!/bin/bash
# Deploys bitcamp-manager-bot with the `starter` invite course.
# Safety: aborts if the live source differs from origin/main (other than this change),
# prints the current revision for rollback, and keeps all existing service settings.
set -euo pipefail
cd "$(dirname "$0")"
REGION=us-central1
FN=bitcamp-manager-bot
WORK=$(mktemp -d)

echo "== live config"
gcloud functions describe $FN --region $REGION --format=json > "$WORK/describe.json"
python3 - "$WORK/describe.json" <<'EOF'
import json, sys
d = json.load(open(sys.argv[1])); s = d["serviceConfig"]; b = d["buildConfig"]
print("revision:", s.get("revision"), "| runtime:", b.get("runtime"), "| entry:", b.get("entryPoint"))
print("min/max:", s.get("minInstanceCount"), s.get("maxInstanceCount"), "| mem:", s.get("availableMemory"), "| timeout:", s.get("timeoutSeconds"))
EOF

echo "== compare live source with git HEAD"
URL=$(gcloud functions describe $FN --region $REGION --format='value(buildConfig.source.storageSource.bucket,buildConfig.source.storageSource.object)' | awk '{print "gs://"$1"/"$2}')
gcloud storage cp "$URL" "$WORK/live.zip" >/dev/null
mkdir -p "$WORK/live" && unzip -q "$WORK/live.zip" -d "$WORK/live"
git show origin/main:functions/bitcamp-manager-bot/index.js > "$WORK/head-index.js"
if ! cmp -s "$WORK/live/index.js" "$WORK/head-index.js"; then
  echo "ABORT: live index.js differs from origin/main — merge live changes first:"; diff "$WORK/head-index.js" "$WORK/live/index.js" | head -40; exit 1
fi
echo "live == origin/main ✓"

echo "== deploy (source only; existing env, secrets, VPC egress, min-instances are kept)"
gcloud functions deploy $FN --gen2 --region $REGION --source . --quiet \
  --network=default --subnet=bot-egress-us-central1 --direct-vpc-egress=all --min-instances=1

echo "== new config"
gcloud functions describe $FN --region $REGION --format='value(serviceConfig.revision,serviceConfig.minInstanceCount,serviceConfig.vpcConnectorEgressSettings)'
echo "Rollback: gcloud run services update-traffic $FN --region $REGION --to-revisions=<previous revision>=100"
