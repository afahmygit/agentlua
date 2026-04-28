#!/bin/bash
# Test individual tools quickly

echo "🧘 Mindful Companion - Tool Testing"
echo "===================================="
echo ""

show_menu() {
    echo "Select a tool to test:"
    echo "  1) Log Mood"
    echo "  2) Get Mood History"
    echo "  3) Write Journal"
    echo "  4) Get Journal Entries"
    echo "  5) Mindfulness Exercise"
    echo "  6) Start Pomodoro"
    echo "  7) Track Habit"
    echo "  8) Get Habit Streaks"
    echo "  9) Get Affirmation"
    echo "  10) Run all tests"
    echo "  0) Exit"
    echo ""
}

run_test() {
    local tool_name=$1
    local input=$2
    local description=$3
    
    echo ""
    echo "----------------------------------------"
    echo "Testing: $description"
    echo "----------------------------------------"
    lua test skill --name "$tool_name" --input "$input"
    echo ""
}

while true; do
    show_menu
    read -p "Enter choice (0-10): " choice
    
    case $choice in
        1)
            read -p "Mood (1-10): " mood
            read -p "Note (optional): " note
            run_test "log_mood" "{\"mood\": $mood, \"note\": \"$note\"}" "Log Mood"
            ;;
        2)
            read -p "Days of history (1-30, default 7): " days
            days=${days:-7}
            run_test "get_mood_history" "{\"days\": $days}" "Get Mood History"
            ;;
        3)
            read -p "Journal entry: " entry
            read -p "Mood (1-10, optional): " mood
            read -p "Tags (comma-separated, optional): " tags
            if [ -n "$mood" ]; then
                run_test "write_journal" "{\"entry\": \"$entry\", \"mood\": $mood}" "Write Journal"
            else
                run_test "write_journal" "{\"entry\": \"$entry\"}" "Write Journal"
            fi
            ;;
        4)
            read -p "Limit (1-20, default 5): " limit
            limit=${limit:-5}
            run_test "get_journal_entries" "{\"limit\": $limit}" "Get Journal Entries"
            ;;
        5)
            echo "Types: breathing, body_scan, gratitude, letting_go, five_senses"
            read -p "Exercise type (default: breathing): " type
            type=${type:-breathing}
            echo "Durations: short (1-2 min), medium (3-5 min), long (5-10 min)"
            read -p "Duration (default: short): " duration
            duration=${duration:-short}
            run_test "mindfulness_exercise" "{\"type\": \"$type\", \"duration\": \"$duration\"}" "Mindfulness Exercise"
            ;;
        6)
            read -p "Task to focus on: " task
            read -p "Duration in minutes (default 25): " duration
            duration=${duration:-25}
            run_test "start_pomodoro" "{\"task\": \"$task\", \"duration\": $duration}" "Start Pomodoro"
            ;;
        7)
            read -p "Habit name: " habit
            read -p "Note (optional): " note
            run_test "track_habit" "{\"habitName\": \"$habit\", \"note\": \"$note\"}" "Track Habit"
            ;;
        8)
            echo "Sort by: streak, name, recent"
            read -p "Sort by (default: streak): " sort
            sort=${sort:-streak}
            run_test "get_habit_streaks" "{\"sortBy\": \"$sort\"}" "Get Habit Streaks"
            ;;
        9)
            echo "Categories: confidence, calm, gratitude, resilience, self_love, motivation, mindfulness, general"
            read -p "Category (default: general): " category
            category=${category:-general}
            read -p "Count (1-5, default 1): " count
            count=${count:-1}
            run_test "get_affirmation" "{\"category\": \"$category\", \"count\": $count}" "Get Affirmation"
            ;;
        10)
            echo "Running all tests..."
            run_test "log_mood" "{\"mood\": 7, \"note\": \"Testing the agent\"}" "Log Mood"
            run_test "get_mood_history" "{\"days\": 7}" "Get Mood History"
            run_test "write_journal" "{\"entry\": \"Today I felt grateful for the sunshine and a good cup of coffee.\", \"mood\": 8, \"tags\": [\"gratitude\"]}" "Write Journal"
            run_test "mindfulness_exercise" "{\"type\": \"breathing\", \"duration\": \"short\"}" "Mindfulness Exercise"
            run_test "start_pomodoro" "{\"task\": \"Testing the Mindful Companion\", \"duration\": 25}" "Start Pomodoro"
            run_test "track_habit" "{\"habitName\": \"meditation\"}" "Track Habit"
            run_test "get_affirmation" "{\"category\": \"confidence\", \"count\": 2}" "Get Affirmation"
            echo ""
            echo "✅ All tests completed!"
            ;;
        0)
            echo "Goodbye! 🧘"
            exit 0
            ;;
        *)
            echo "Invalid choice. Please try again."
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
    clear
done
