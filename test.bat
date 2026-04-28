@echo off
REM Test individual tools quickly on Windows

echo 🧘 Mindful Companion - Tool Testing
echo ====================================
echo.

:menu
echo Select a tool to test:
echo   1) Log Mood
echo   2) Get Mood History
echo   3) Write Journal
echo   4) Get Journal Entries
echo   5) Mindfulness Exercise
echo   6) Start Pomodoro
echo   7) Track Habit
echo   8) Get Habit Streaks
echo   9) Get Affirmation
echo   10) Run all tests
echo   0) Exit
echo.

set /p choice="Enter choice (0-10): "

if "%choice%"=="1" goto log_mood
if "%choice%"=="2" goto mood_history
if "%choice%"=="3" goto write_journal
if "%choice%"=="4" goto journal_entries
if "%choice%"=="5" goto mindfulness
if "%choice%"=="6" goto pomodoro
if "%choice%"=="7" goto track_habit
if "%choice%"=="8" goto habit_streaks
if "%choice%"=="9" goto affirmation
if "%choice%"=="10" goto all_tests
if "%choice%"=="0" goto exit

echo Invalid choice. Please try again.
goto menu

:log_mood
set /p mood="Mood (1-10): "
set /p note="Note (optional): "
echo.
echo ----------------------------------------
echo Testing: Log Mood
echo ----------------------------------------
lua test skill --name log_mood --input "{\"mood\": %mood%, \"note\": \"%note%\"}"
goto continue

:mood_history
set /p days="Days of history (1-30, default 7): "
if "%days%"=="" set days=7
echo.
echo ----------------------------------------
echo Testing: Get Mood History
echo ----------------------------------------
lua test skill --name get_mood_history --input "{\"days\": %days%}"
goto continue

:write_journal
set /p entry="Journal entry: "
set /p mood="Mood (1-10, optional): "
echo.
echo ----------------------------------------
echo Testing: Write Journal
echo ----------------------------------------
if "%mood%"=="" (
    lua test skill --name write_journal --input "{\"entry\": \"%entry%\"}"
) else (
    lua test skill --name write_journal --input "{\"entry\": \"%entry%\", \"mood\": %mood%}"
)
goto continue

:journal_entries
set /p limit="Limit (1-20, default 5): "
if "%limit%"=="" set limit=5
echo.
echo ----------------------------------------
echo Testing: Get Journal Entries
echo ----------------------------------------
lua test skill --name get_journal_entries --input "{\"limit\": %limit%}"
goto continue

:mindfulness
echo Types: breathing, body_scan, gratitude, letting_go, five_senses
set /p type="Exercise type (default: breathing): "
if "%type%"=="" set type=breathing
echo Durations: short (1-2 min), medium (3-5 min), long (5-10 min)
set /p duration="Duration (default: short): "
if "%duration%"=="" set duration=short
echo.
echo ----------------------------------------
echo Testing: Mindfulness Exercise
echo ----------------------------------------
lua test skill --name mindfulness_exercise --input "{\"type\": \"%type%\", \"duration\": \"%duration%\"}"
goto continue

:pomodoro
set /p task="Task to focus on: "
set /p duration="Duration in minutes (default 25): "
if "%duration%"=="" set duration=25
echo.
echo ----------------------------------------
echo Testing: Start Pomodoro
echo ----------------------------------------
lua test skill --name start_pomodoro --input "{\"task\": \"%task%\", \"duration\": %duration%}"
goto continue

:track_habit
set /p habit="Habit name: "
set /p note="Note (optional): "
echo.
echo ----------------------------------------
echo Testing: Track Habit
echo ----------------------------------------
lua test skill --name track_habit --input "{\"habitName\": \"%habit%\", \"note\": \"%note%\"}"
goto continue

:habit_streaks
echo Sort by: streak, name, recent
set /p sort="Sort by (default: streak): "
if "%sort%"=="" set sort=streak
echo.
echo ----------------------------------------
echo Testing: Get Habit Streaks
echo ----------------------------------------
lua test skill --name get_habit_streaks --input "{\"sortBy\": \"%sort%\"}"
goto continue

:affirmation
echo Categories: confidence, calm, gratitude, resilience, self_love, motivation, mindfulness, general
set /p category="Category (default: general): "
if "%category%"=="" set category=general
set /p count="Count (1-5, default 1): "
if "%count%"=="" set count=1
echo.
echo ----------------------------------------
echo Testing: Get Affirmation
echo ----------------------------------------
lua test skill --name get_affirmation --input "{\"category\": \"%category%\", \"count\": %count%}"
goto continue

:all_tests
echo Running all tests...
echo.
echo ----------------------------------------
echo Testing: Log Mood
echo ----------------------------------------
lua test skill --name log_mood --input "{\"mood\": 7, \"note\": \"Testing the agent\"}"

echo.
echo ----------------------------------------
echo Testing: Get Mood History
echo ----------------------------------------
lua test skill --name get_mood_history --input "{\"days\": 7}"

echo.
echo ----------------------------------------
echo Testing: Write Journal
echo ----------------------------------------
lua test skill --name write_journal --input "{\"entry\": \"Today I felt grateful for the sunshine and a good cup of coffee.\", \"mood\": 8, \"tags\": [\"gratitude\"]}"

echo.
echo ----------------------------------------
echo Testing: Mindfulness Exercise
echo ----------------------------------------
lua test skill --name mindfulness_exercise --input "{\"type\": \"breathing\", \"duration\": \"short\"}"

echo.
echo ----------------------------------------
echo Testing: Start Pomodoro
echo ----------------------------------------
lua test skill --name start_pomodoro --input "{\"task\": \"Testing the Mindful Companion\", \"duration\": 25}"

echo.
echo ----------------------------------------
echo Testing: Track Habit
echo ----------------------------------------
lua test skill --name track_habit --input "{\"habitName\": \"meditation\"}"

echo.
echo ----------------------------------------
echo Testing: Get Affirmation
echo ----------------------------------------
lua test skill --name get_affirmation --input "{\"category\": \"confidence\", \"count\": 2}"

echo.
echo ✅ All tests completed!
goto continue

:continue
echo.
pause
echo.
goto menu

:exit
echo Goodbye! 🧘
pause
