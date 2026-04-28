# Mindful Companion Agent

A creative wellness and productivity AI companion built on the Lua platform. This agent helps users track their mood, build habits, practice mindfulness, and stay productive - all through natural conversation.

## What Makes This Creative

Unlike typical task-oriented agents, the Mindful Companion:
- **Combines wellness + productivity** in one seamless experience
- **Uses persistent user state** to remember your journey and progress
- **Adapts to your emotional state** - offers different support based on your mood
- **Creates a daily ritual** through habit tracking and affirmations
- **Provides actionable mindfulness** - not just advice, but interactive exercises
- **Celebrates streaks and progress** to build positive reinforcement

## Quick Start (Choose Your Platform)

### Option 1: One-Click Setup Script

**macOS / Linux:**
```bash
# Make executable and run
chmod +x setup.sh
./setup.sh
```

**Windows:**
```cmd
# Double-click or run in Command Prompt
setup.bat
```

### Option 2: Manual Setup

**Step 1: Install dependencies**
```bash
npm install
```

**Step 2: Install Lua CLI globally**
```bash
npm install -g lua-cli
```

**Step 3: Authenticate**
```bash
# With API key
lua auth configure --api-key YOUR_API_KEY

# Or with email
lua auth configure --email your@email.com
# Then enter the OTP code you receive
lua auth configure --email your@email.com --otp 123456
```

**Step 4: Initialize agent**
```bash
lua init --agent-name "Mindful Companion" --org-id YOUR_ORG_ID
```

**Step 5: Test**
```bash
npm run test:all
```

**Step 6: Deploy**
```bash
npm run deploy
```

## Cross-Platform Scripts

### Setup
| Platform | Command |
|----------|---------|
| macOS/Linux | `./setup.sh` or `npm run setup:mac` |
| Windows | `setup.bat` or `npm run setup:win` |

### Chat with Agent
| Platform | Command |
|----------|---------|
| macOS/Linux | `./chat.sh` or `npm run chat` |
| Windows | `chat.bat` or `npm run chat:win` |
| Interactive | `npm run chat:sandbox` |
| Single message | `./chat.sh "How are you?"` |

### Test Tools
| Platform | Command |
|----------|---------|
| macOS/Linux | `./test.sh` or `npm run test` |
| Windows | `test.bat` or `npm run test:win` |
| Quick test all | `npm run test:all` |
| Test mood | `npm run test:mood` |
| Test affirmations | `npm run test:affirmation` |
| Test habits | `npm run test:habit` |

### Deploy
| Platform | Command |
|----------|---------|
| macOS/Linux | `./deploy.sh` or `npm run deploy` |
| Windows | `deploy.bat` or `npm run deploy:win` |

### View Logs
| Platform | Command |
|----------|---------|
| macOS/Linux | `./logs.sh` or `npm run logs` |
| Windows | `logs.bat` or `npm run logs:win` |
| Skill logs | `./logs.sh skill 20` |

## Features

- **Mood Tracking**: Log daily moods with notes and see patterns over time
- **Journal**: Write reflective journal entries with AI-powered insights
- **Mindfulness Exercises**: Guided breathing, body scan, gratitude, letting go, and 5-senses exercises
- **Pomodoro Timer**: Productivity sessions with mindful breaks
- **Habit Tracker**: Build and maintain positive habits with streak tracking
- **Personalized Affirmations**: Daily affirmations based on mood and goals

## Tools Overview

| Tool | Description | Test Command |
|------|-------------|--------------|
| `log_mood` | Log your current mood (1-10) with optional notes | `npm run test:mood` |
| `get_mood_history` | View your mood trends over time | `./test.sh` → option 2 |
| `write_journal` | Write a journal entry with AI reflection prompts | `npm run test:journal` |
| `get_journal_entries` | Retrieve past journal entries | `./test.sh` → option 4 |
| `mindfulness_exercise` | Get a guided mindfulness exercise | `npm run test:mindfulness` |
| `start_pomodoro` | Start a focused work session | `npm run test:pomodoro` |
| `track_habit` | Log a habit completion | `npm run test:habit` |
| `get_habit_streaks` | View your habit streaks and progress | `./test.sh` → option 8 |
| `get_affirmation` | Get a personalized daily affirmation | `npm run test:affirmation` |

## Example Conversations

**Mood Check-in:**
```
User: "I'm feeling anxious about my presentation tomorrow"
Agent: "I hear you. Let's log this feeling and do a quick calming exercise..."
```

**Productivity:**
```
User: "I need to focus on my project"
Agent: "I'll start a 25-minute Pomodoro session for you. Ready to begin?"
```

**Habit Building:**
```
User: "I meditated today"
Agent: "Great job! That's 5 days in a row for your meditation habit!"
```

**Mindfulness:**
```
User: "Help me relax"
Agent: "Let's do a breathing exercise together. Find a comfortable position..."
```

## Architecture

```
src/
├── index.ts                          # Agent configuration
├── skills/
│   └── MindfulCompanionSkill.ts      # Main skill definition
└── tools/
    ├── MoodTrackingTool.ts           # Mood logging & history
    ├── JournalTool.ts                # Journal entries
    ├── MindfulnessTool.ts            # Guided exercises
    ├── PomodoroTool.ts               # Focus timer
    ├── HabitTrackingTool.ts          # Habit streaks
    └── AffirmationTool.ts            # Daily affirmations
```

## Project Structure

```
mindful-companion-agent/
├── src/                          # Source code
│   ├── index.ts                  # Agent config
│   ├── skills/                   # Skills
│   └── tools/                    # Tools
├── setup.sh / setup.bat          # One-click setup
├── chat.sh / chat.bat            # Chat with agent
├── test.sh / test.bat            # Test all tools
├── deploy.sh / deploy.bat        # Deploy to production
├── logs.sh / logs.bat            # View logs
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript config
└── README.md                     # This file
```

## Development Workflow

```bash
# 1. Make changes to tools
# 2. Test individual tool
lua test skill --name log_mood --input '{"mood": 8}'

# 3. Test with full agent
lua chat -e sandbox -m "I'm feeling stressed"

# 4. Check logs
lua logs --type skill --limit 10

# 5. Push and deploy
lua push all --force
lua deploy skill --name mindful-companion --set-version latest --force

# 6. Test in production
lua chat -e production -m "Hello!"
```

## Environment Variables

Create a `.env` file for local development:
```
# Add any API keys or secrets here
# These are only used in sandbox mode
```

For production, set variables via CLI:
```bash
lua env production -k KEY_NAME -v "your-value"
```

## License

MIT
