#!/bin/bash
# audit-security.sh — Scan automatique des failles de securite courantes
# Usage : bash skills/security/scripts/audit-security.sh

ERRORS=0
WARNINGS=0

echo "=== Audit securite aiactio ==="
echo ""

# 1. Server Actions sans auth
echo "[ ] Server Actions sans getUser()..."
for file in lib/actions/*.ts; do
  # Chercher les fonctions sans getUser dans les 15 premieres lignes de chaque fonction
  if grep -q "^export async function" "$file"; then
    if ! grep -q "getUser\|auth\.uid" "$file"; then
      echo "  ERREUR: $file — aucune auth detectee"
      ERRORS=$((ERRORS + 1))
    fi
  fi
done

# 2. SUPABASE_SERVICE_ROLE_KEY dans des composants clients
echo "[ ] SERVICE_ROLE_KEY dans des composants client..."
results=$(grep -r "SUPABASE_SERVICE_ROLE_KEY" app/ components/ --include="*.tsx" --include="*.ts" -l 2>/dev/null)
if [ -n "$results" ]; then
  echo "  ERREUR: SERVICE_ROLE_KEY detectee dans:"
  echo "$results" | sed 's/^/    /'
  ERRORS=$((ERRORS + 1))
fi

# 3. Variables NEXT_PUBLIC_ contenant des secrets
echo "[ ] Secrets dans NEXT_PUBLIC_..."
results=$(grep -r "NEXT_PUBLIC_.*SECRET\|NEXT_PUBLIC_.*KEY\|NEXT_PUBLIC_.*TOKEN" . --include=".env*" -l 2>/dev/null | grep -v ".example")
if [ -n "$results" ]; then
  echo "  ATTENTION: Possible secret en NEXT_PUBLIC_:"
  echo "$results" | sed 's/^/    /'
  WARNINGS=$((WARNINGS + 1))
fi

# 4. Middleware manquant
echo "[ ] Middleware de protection /dashboard..."
if [ ! -f "middleware.ts" ]; then
  echo "  ERREUR: middleware.ts absent"
  ERRORS=$((ERRORS + 1))
else
  if ! grep -q "dashboard" middleware.ts; then
    echo "  ATTENTION: middleware.ts ne protege pas /dashboard"
    WARNINGS=$((WARNINGS + 1))
  fi
fi

# 5. Tables sans RLS (a verifier manuellement dans Supabase)
echo "[ ] Migrations avec ENABLE ROW LEVEL SECURITY..."
migration_files=$(ls supabase/migrations/*.sql 2>/dev/null)
if [ -z "$migration_files" ]; then
  echo "  INFO: Aucune migration trouvee"
else
  for f in $migration_files; do
    tables=$(grep "CREATE TABLE" "$f" | grep -oP "(?<=TABLE )\w+" | head -5)
    for table in $tables; do
      if ! grep -q "ENABLE ROW LEVEL SECURITY.*$table\|$table.*ENABLE ROW LEVEL SECURITY\|ALTER TABLE $table ENABLE" "$f"; then
        echo "  ATTENTION: Table '$table' dans $f — RLS non confirmee dans ce fichier"
        WARNINGS=$((WARNINGS + 1))
      fi
    done
  done
fi

# 6. `as any` dans les actions (risque type safety)
echo "[ ] Utilisation de 'as any'..."
results=$(grep -rn " as any" lib/actions/ 2>/dev/null)
if [ -n "$results" ]; then
  echo "  ATTENTION: 'as any' detecte:"
  echo "$results" | head -5 | sed 's/^/    /'
  WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "=== Resultat ==="
echo "Erreurs critiques : $ERRORS"
echo "Avertissements    : $WARNINGS"
echo ""

if [ "$ERRORS" -gt 0 ]; then
  echo "ECHEC — Corriger les erreurs critiques avant de deployer"
  exit 1
else
  echo "OK — Aucune erreur critique detectee"
fi
