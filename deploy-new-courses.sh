#!/bin/bash
# Run from Mac mini: cd ~/aladiah-ai-spark && git pull && bash deploy-new-courses.sh
set -e

PROJECT_REF="vgujnkxylipfwmkpwzvb"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZndWpua3h5bGlwZndta3B3enZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMzYyMTUsImV4cCI6MjA4OTcxMjIxNX0.wpP8ZK0dtEegUu3r1f--sIkNHN1GnHTzvIstVAi1k20"
BASE_URL="https://${PROJECT_REF}.supabase.co/functions/v1"

# ALL 28 main programs
COURSES=(
  "seed-ai-cloud-engineer"
  "seed-ai-agent-engineer"
  "seed-ai-data-engineer"
  "seed-ai-devops-engineer"
  "seed-ai-mlops-engineer"
  "seed-ai-security-engineer-v2"
  "seed-ai-platform-engineer"
  "seed-ai-solutions-architect"
  "seed-ai-solutions-consultant"
  "seed-ai-product-manager"
  "seed-ai-program-manager"
  "seed-ai-transformation-manager"
  "seed-ai-business-analyst"
  "seed-ai-sales-engineer"
  "seed-ai-enterprise-architect"
  "seed-ai-business-operations"
  "seed-ai-governance-professional"
  "seed-responsible-ai-specialist"
  "seed-ai-compliance-officer"
  "seed-ai-risk-manager"
  "seed-ai-auditor"
  "seed-ai-ethics-specialist"
  "seed-ai-policy-designer"
  "seed-ai-ux-designer"
  "seed-conversation-designer"
  "seed-human-ai-interaction-specialist"
  "seed-ai-workflow-designer"
  "seed-ai-experience-architect"
)

echo "=== Deploying all 28 programs ==="
for fn in "${COURSES[@]}"; do
  echo ""
  echo ">>> Deploying $fn..."
  echo "y" | npx supabase functions deploy "$fn" --project-ref "$PROJECT_REF" 2>&1 | tail -2
done

echo ""
echo "=== Seeding all 28 programs (5s settle time) ==="
sleep 5

for fn in "${COURSES[@]}"; do
  echo -n "Seeding $fn... "
  result=$(curl -s -X POST "${BASE_URL}/${fn}" \
    -H "Authorization: Bearer ${ANON_KEY}" \
    -H "Content-Type: application/json")
  
  if echo "$result" | python3 -c "
import sys,json
d=json.load(sys.stdin)
msg=d.get('message','')
err=d.get('error','')
if err: print('ERROR: '+str(err)[:80])
else: print('OK: '+msg[:60])
" 2>/dev/null; then :
  else echo "Raw: ${result:0:100}"; fi
done

echo ""
echo "=== All 28 programs deployed and seeded ==="
