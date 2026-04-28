@echo off
REM Deploy the Mindful Companion agent to production

echo 🧘 Mindful Companion - Deployment
echo ==================================
echo.

echo Step 1: Pushing code to server...
call lua push all --force

if errorlevel 1 (
    echo [ERROR] Push failed. Check logs for errors.
    pause
    exit /b 1
)

echo.
echo Step 2: Deploying to production...
call lua deploy skill --name mindful-companion --set-version latest --force

if errorlevel 1 (
    echo [ERROR] Deployment failed. Check logs for errors.
    pause
    exit /b 1
)

echo.
echo [OK] Deployment successful!
echo.
echo Your Mindful Companion is now live!
echo Test it with: chat.bat "Hello!"
pause
