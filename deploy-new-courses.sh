#!/bin/bash
# Run this from your Mac mini: cd ~/aladiah-ai-spark && bash deploy-new-courses.sh
set -e

PROJECT_REF="vgujnkxylipfwmkpwzvb"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZndWpua3h5bGlwZndta3B3enZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMzYyMTUsImV4cCI6MjA4OTcxMjIxNX0.wpP8ZK0dtEegUu3r1f--sIkNHN1GnHTzvIstVAi1k20"
BASE_URL="https://${PROJECT_REF}.supabase.co/functions/v1"

COURSES=(
  "seed-ai-data-engineer"
  "seed-ai-devops-engineer"
  "seed-ai-mlops-engineer"
  "seed-ai-security-engineer-v2"
  "seed-ai-governance-professional"
  "seed-ai-platform-engineer"
  "seed-ai-solutions-architect"
)

echo "=== Deploying ${#COURSES[@]} courses ==="
for fn in "${COURSES[@]}"; do
  echo ""
  echo ">>> Deploying $fn..."
  npx supabase functions deploy "$fn" --project-ref "$PROJECT_REF" && echo "✓ Deployed $fn" || echo "✗ Deploy failed: $fn"
done

echo ""
echo "=== Seeding courses ==="
for fn in "${COURSES[@]}"; do
  echo ""
  echo ">>> Seeding $fn..."
  result=$(curl -s -X POST "${BASE_URL}/${fn}" \
    -H "Authorization: Bearer ${ANON_KEY}" \
    -H "Content-Type: application/json")
  echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); print('✓', d.get('message', d.get('error','unknown')))" 2>/dev/null || echo "$result"
done

echo ""
echo "=== Done ==="
