#!/bin/bash
# Run all database migrations in order
# Usage: ./run-all-migrations.sh or bash run-all-migrations.sh

set -e  # Exit on error

echo "🚀 Starting database migrations..."
echo ""

# List of migrations in order
MIGRATIONS=(
  "001_initial_schema.sql"
  "002_add_client_profile_fields.sql"
  "003_add_provider_profile_fields.sql"
  "004_fix_provider_profile_fields.sql"
  "005_add_provider_availability_jsonb.sql"
  "006_add_provider_add_ons.sql"
  "007_add_provider_certifications.sql"
  "008_make_service_id_nullable.sql"
  "009_add_provider_client_notes.sql"
  "010_add_space_owner_profile_fields.sql"
  "011_add_messages_table.sql"
  "012_add_message_user_metadata.sql"
  "013_add_profile_visits_table.sql"
  "014_add_oauth_provider_ids.sql"
  "014_add_subscription_data.sql"
  "014_add_two_factor_auth.sql"
  "015_increase_business_type_length.sql"
  "016_add_travel_fields.sql"
  "017_add_missing_provider_columns.sql"
)

TOTAL=${#MIGRATIONS[@]}
SUCCESS=0
FAILED=0

for i in "${!MIGRATIONS[@]}"; do
  MIGRATION="${MIGRATIONS[$i]}"
  NUM=$((i + 1))
  
  if [ ! -f "$MIGRATION" ]; then
    echo "⏭️  [$NUM/$TOTAL] $MIGRATION - File not found, skipping"
    continue
  fi
  
  echo "🔄 [$NUM/$TOTAL] Running $MIGRATION..."
  
  if psql $DATABASE_URL -f "$MIGRATION" > /dev/null 2>&1; then
    echo "✅ [$NUM/$TOTAL] $MIGRATION - Success"
    ((SUCCESS++))
  else
    # Check if it's an "already exists" error (which is usually fine)
    ERROR_OUTPUT=$(psql $DATABASE_URL -f "$MIGRATION" 2>&1 || true)
    if echo "$ERROR_OUTPUT" | grep -qi "already exists\|duplicate"; then
      echo "⚠️  [$NUM/$TOTAL] $MIGRATION - Already applied (skipping)"
    else
      echo "❌ [$NUM/$TOTAL] $MIGRATION - Failed"
      echo "$ERROR_OUTPUT" | head -5
      ((FAILED++))
    fi
  fi
  echo ""
done

echo "============================================================"
echo "📋 Migration Summary"
echo "============================================================"
echo "✅ Successful: $SUCCESS"
echo "❌ Failed: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "🎉 All migrations completed successfully!"
  exit 0
else
  echo "⚠️  Some migrations failed. Please review the errors above."
  exit 1
fi
