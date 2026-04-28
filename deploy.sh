#!/bin/bash
# Deploy the Mindful Companion agent to production

echo "🧘 Mindful Companion - Deployment"
echo "=================================="
echo ""

# Check if authenticated
if ! lua auth configure --list &>/dev/null; then
    echo "⚠️  Not authenticated. Please run setup first."
    exit 1
fi

echo "Step 1: Pushing code to server..."
lua push all --force

if [ $? -ne 0 ]; then
    echo "❌ Push failed. Check logs for errors."
    exit 1
fi

echo ""
echo "Step 2: Deploying to production..."
lua deploy skill --name mindful-companion --set-version latest --force

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed. Check logs for errors."
    exit 1
fi

echo ""
echo "✅ Deployment successful!"
echo ""
echo "Your Mindful Companion is now live!"
echo "Test it with: ./chat.sh 'Hello!'"
