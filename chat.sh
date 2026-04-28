#!/bin/bash
# Quick chat with your Mindful Companion agent in sandbox mode

echo "🧘 Starting chat with Mindful Companion..."
echo "Type your message or press Ctrl+C to exit"
echo ""

if [ -z "$1" ]; then
    # Interactive mode
    lua chat -e sandbox
else
    # Single message mode
    lua chat -e sandbox -m "$1"
fi
