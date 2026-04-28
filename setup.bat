@echo off
REM Mindful Companion Agent - Windows Setup Script
REM This script sets up the entire project from scratch

setlocal enabledelayedexpansion

echo 🧘 Mindful Companion Agent - Setup Script
echo ==========================================
echo.

REM Check if Node.js is installed
echo Checking Node.js installation...
node -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    echo Visit: https://nodejs.org/
    exit /b 1
)

for /f "tokens=1 delims=v." %%a in ('node -v') do set NODE_MAJOR=%%a
if %NODE_MAJOR% LSS 18 (
    echo [ERROR] Node.js version must be 18 or higher.
    exit /b 1
)

echo [OK] Node.js detected
echo.

REM Check npm
npm -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed.
    exit /b 1
)
echo [OK] npm detected
echo.

REM Install dependencies
echo Installing project dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies.
    exit /b 1
)
echo [OK] Dependencies installed
echo.

REM Check Lua CLI
echo Checking Lua CLI installation...
lua -v >nul 2>&1
if errorlevel 1 (
    echo Lua CLI not found. Installing globally...
    call npm install -g lua-cli
    if errorlevel 1 (
        echo [ERROR] Failed to install Lua CLI.
        exit /b 1
    )
    echo [OK] Lua CLI installed globally
) else (
    echo [OK] Lua CLI already installed
)
echo.

REM Authentication
echo Authentication Setup
echo --------------------
echo You need a Lua API key to deploy this agent.
echo.
echo Options:
echo   1) I already have an API key
echo   2) I need to authenticate with email
echo   3) Skip authentication for now
echo.
set /p auth_option="Select option (1-3): "

if "%auth_option%"=="1" (
    set /p api_key="Enter your API key: "
    call lua auth configure --api-key "!api_key!"
    echo [OK] Authenticated with API key
) else if "%auth_option%"=="2" (
    set /p email="Enter your email: "
    call lua auth configure --email "!email!"
    echo.
    echo Check your email for the 6-digit OTP code.
    set /p otp="Enter OTP code: "
    call lua auth configure --email "!email!" --otp "!otp!"
    echo [OK] Authenticated with email
) else (
    echo [INFO] Skipping authentication. Run 'lua auth configure' later.
)

echo.

REM Initialize agent
echo Agent Initialization
echo --------------------
if exist "lua.skill.yaml" (
    echo Agent already initialized (lua.skill.yaml found).
    set /p reinit="Re-initialize? This will overwrite existing config (y/N): "
    if /i "!reinit!"=="y" (
        set /p org_id="Enter your Organization ID: "
        call lua init --agent-name "Mindful Companion" --org-id "!org_id!" --force
        echo [OK] Agent re-initialized
    ) else (
        echo [OK] Keeping existing configuration
    )
) else (
    set /p org_id="Enter your Organization ID: "
    echo.
    echo Initializing agent...
    call lua init --agent-name "Mindful Companion" --org-id "!org_id!"
    echo [OK] Agent initialized
)

echo.

REM Test the agent
echo Testing the Agent
echo -----------------
echo Let's run a quick test to make sure everything works!
echo.
set /p run_tests="Run tests? (Y/n): "

if /i not "%run_tests%"=="n" (
    echo.
    echo Testing mood logging...
    call lua test skill --name log_mood --input "{\"mood\": 8, \"note\": \"Feeling great today!\"}"
    
    echo.
    echo Testing affirmation...
    call lua test skill --name get_affirmation --input "{\"category\": \"confidence\", \"count\": 2}"
    
    echo.
    echo Testing habit tracking...
    call lua test skill --name track_habit --input "{\"habitName\": \"meditation\"}"
    
    echo.
    echo [OK] All tests completed!
)

echo.

REM Deployment
echo Deployment
echo ----------
set /p deploy_now="Deploy to production now? (y/N): "

if /i "%deploy_now%"=="y" (
    echo Pushing to server...
    call lua push all --force
    
    echo.
    echo Deploying...
    call lua deploy skill --name mindful-companion --set-version latest --force
    
    echo.
    echo [OK] Deployment complete!
) else (
    echo [INFO] Skipping deployment. Run deploy.bat later.
)

echo.
echo ========================================
echo Setup Complete! 🎉
echo ========================================
echo.
echo Next steps:
echo   1. Chat with your agent: chat.bat
echo   2. Test tools: test.bat
echo   3. Deploy: deploy.bat
echo   4. View logs: logs.bat
echo.
echo Your Mindful Companion is ready to help you!
echo.

pause
