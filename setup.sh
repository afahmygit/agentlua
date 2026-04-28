#!/bin/bash
# Mindful Companion Agent - macOS/Linux Setup Script
# This script sets up the entire project from scratch

set -e

echo "🧘 Mindful Companion Agent - Setup Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo -e "${BLUE}Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 18+ first.${NC}"
    echo "Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Node.js version must be 18 or higher. Current: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}Node.js $(node -v) detected ✓${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed.${NC}"
    exit 1
fi
echo -e "${GREEN}npm $(npm -v) detected ✓${NC}"

echo ""

# Install dependencies
echo -e "${BLUE}Installing project dependencies...${NC}"
npm install
echo -e "${GREEN}Dependencies installed ✓${NC}"

echo ""

# Check if Lua CLI is installed globally
echo -e "${BLUE}Checking Lua CLI installation...${NC}"
if ! command -v lua &> /dev/null; then
    echo -e "${YELLOW}Lua CLI not found globally. Installing...${NC}"
    npm install -g lua-cli
    echo -e "${GREEN}Lua CLI installed globally ✓${NC}"
else
    echo -e "${GREEN}Lua CLI already installed ✓${NC}"
fi

echo ""

# Authentication
echo -e "${BLUE}Authentication Setup${NC}"
echo "--------------------"
echo "You need a Lua API key to deploy this agent."
echo ""
echo "Options:"
echo "  1) I already have an API key"
echo "  2) I need to authenticate with email"
echo "  3) Skip authentication for now"
echo ""
read -p "Select option (1-3): " auth_option

case $auth_option in
    1)
        read -sp "Enter your API key: " api_key
        echo ""
        lua auth configure --api-key "$api_key"
        echo -e "${GREEN}Authenticated with API key ✓${NC}"
        ;;
    2)
        read -p "Enter your email: " email
        lua auth configure --email "$email"
        echo ""
        echo -e "${YELLOW}Check your email for the 6-digit OTP code.${NC}"
        read -p "Enter OTP code: " otp
        lua auth configure --email "$email" --otp "$otp"
        echo -e "${GREEN}Authenticated with email ✓${NC}"
        ;;
    3)
        echo -e "${YELLOW}Skipping authentication. Run 'lua auth configure' later.${NC}"
        ;;
    *)
        echo -e "${YELLOW}Invalid option. Skipping authentication.${NC}"
        ;;
esac

echo ""

# Initialize agent
echo -e "${BLUE}Agent Initialization${NC}"
echo "--------------------"
if [ -f "lua.skill.yaml" ]; then
    echo -e "${YELLOW}Agent already initialized (lua.skill.yaml found).${NC}"
    read -p "Re-initialize? This will overwrite existing config (y/N): " reinit
    if [[ $reinit =~ ^[Yy]$ ]]; then
        read -p "Enter your Organization ID: " org_id
        lua init --agent-name "Mindful Companion" --org-id "$org_id" --force
        echo -e "${GREEN}Agent re-initialized ✓${NC}"
    else
        echo -e "${GREEN}Keeping existing configuration ✓${NC}"
    fi
else
    read -p "Enter your Organization ID: " org_id
    echo ""
    echo -e "${BLUE}Initializing agent...${NC}"
    lua init --agent-name "Mindful Companion" --org-id "$org_id"
    echo -e "${GREEN}Agent initialized ✓${NC}"
fi

echo ""

# Test the agent
echo -e "${BLUE}Testing the Agent${NC}"
echo "-----------------"
echo "Let's run a quick test to make sure everything works!"
echo ""
read -p "Run tests? (Y/n): " run_tests

if [[ ! $run_tests =~ ^[Nn]$ ]]; then
    echo ""
    echo -e "${BLUE}Testing mood logging...${NC}"
    lua test skill --name log_mood --input '{"mood": 8, "note": "Feeling great today!"}'
    
    echo ""
    echo -e "${BLUE}Testing affirmation...${NC}"
    lua test skill --name get_affirmation --input '{"category": "confidence", "count": 2}'
    
    echo ""
    echo -e "${BLUE}Testing habit tracking...${NC}"
    lua test skill --name track_habit --input '{"habitName": "meditation"}'
    
    echo ""
    echo -e "${GREEN}All tests completed! ✓${NC}"
fi

echo ""

# Deployment
echo -e "${BLUE}Deployment${NC}"
echo "----------"
read -p "Deploy to production now? (y/N): " deploy_now

if [[ $deploy_now =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Pushing to server...${NC}"
    lua push all --force
    
    echo ""
    echo -e "${BLUE}Deploying...${NC}"
    lua deploy skill --name mindful-companion --set-version latest --force
    
    echo ""
    echo -e "${GREEN}Deployment complete! ✓${NC}"
else
    echo -e "${YELLOW}Skipping deployment. Run the deploy script later.${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Setup Complete! 🎉${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Chat with your agent: ./chat.sh"
echo "  2. Test tools: ./test.sh"
echo "  3. Deploy: ./deploy.sh"
echo "  4. View logs: ./logs.sh"
echo ""
echo "Your Mindful Companion is ready to help you!"
echo ""
