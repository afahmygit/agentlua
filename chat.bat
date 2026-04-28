@echo off
REM Quick chat with your Mindful Companion agent in sandbox mode

echo 🧘 Starting chat with Mindful Companion...
echo Type your message or press Ctrl+C to exit
echo.

if "%~1"=="" (
    REM Interactive mode
    lua chat -e sandbox
) else (
    REM Single message mode
    lua chat -e sandbox -m "%~1"
)

pause
