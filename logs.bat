@echo off
REM View logs for the Mindful Companion agent

echo 🧘 Mindful Companion - Logs
echo ============================
echo.

set TYPE=%~1
if "%TYPE%"=="" set TYPE=all

set LIMIT=%~2
if "%LIMIT%"=="" set LIMIT=20

echo Showing %TYPE% logs (last %LIMIT% entries)...
echo.

lua logs --type %TYPE% --limit %LIMIT%

echo.
echo Usage: logs.bat [type] [limit]
echo   Types: all, skill, job, webhook, preprocessor, postprocessor
echo   Example: logs.bat skill 10

pause
