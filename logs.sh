#!/bin/bash
# View logs for the Mindful Companion agent

echo "🧘 Mindful Companion - Logs"
echo "============================"
echo ""

# Parse arguments
TYPE=${1:-all}
LIMIT=${2:-20}

echo "Showing $TYPE logs (last $LIMIT entries)..."
echo ""

lua logs --type "$TYPE" --limit "$LIMIT"

echo ""
echo "Usage: ./logs.sh [type] [limit]"
echo "  Types: all, skill, job, webhook, preprocessor, postprocessor"
echo "  Example: ./logs.sh skill 10"
