#!/bin/bash
# run-validate.sh — Validation complete avant commit
# Usage : bash skills/testing/scripts/run-validate.sh

set -e
cd "$(dirname "$0")/../../.."

echo "=== Validation aiactio ==="
echo ""

echo "[ 1/4 ] Lint..."
npm run lint
echo "OK"

echo "[ 2/4 ] TypeScript..."
npx tsc --noEmit
echo "OK"

echo "[ 3/4 ] Tests..."
npm test -- --run
echo "OK"

echo "[ 4/4 ] Build..."
npm run build
echo "OK"

echo ""
echo "=== Tout est vert — commit possible ==="
