#!/bin/bash
# verify-actions.sh — Verifie que toutes les Server Actions ont une auth check
# Usage : bash skills/backend/scripts/verify-actions.sh

ACTIONS_DIR="lib/actions"
ERRORS=0

echo "Verification des Server Actions dans $ACTIONS_DIR..."
echo ""

for file in $ACTIONS_DIR/*.ts; do
  # Trouver les fonctions export async
  funcs=$(grep -n "^export async function" "$file" | sed 's/:.*//;s/ /:/g')
  
  while IFS= read -r line; do
    lineno=$(echo "$line" | cut -d: -f1)
    funcname=$(echo "$line" | grep -oP "function \K\w+")
    
    # Verifier si la fonction contient getUser dans les 20 lignes suivantes
    has_auth=$(awk "NR>=$lineno && NR<=$((lineno+20))" "$file" | grep -c "getUser\|auth\.uid")
    
    if [ "$has_auth" -eq 0 ]; then
      echo "ATTENTION: $file:$lineno — $funcname() sans auth check visible"
      ERRORS=$((ERRORS + 1))
    fi
  done <<< "$funcs"
done

echo ""
if [ "$ERRORS" -eq 0 ]; then
  echo "OK — Toutes les Server Actions semblent avoir une auth check"
else
  echo "ERREURS: $ERRORS action(s) sans auth check detectee(s)"
  exit 1
fi
