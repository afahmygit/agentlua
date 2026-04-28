# AGENTS.md — Mindful Companion Agent

## Platform & Architecture

This is a **Lua AI agent** built on the [heylua.ai](https://docs.heylua.ai) platform. It is not a standalone app — it compiles to Lua platform primitives (skills, tools) and runs inside Lua's managed sandbox.

- **Entrypoint**: `src/index.ts` exports a `LuaAgent` instance
- **Skill**: `src/skills/MindfulCompanionSkill.ts` bundles 9 tools
- **Tools**: `src/tools/*.ts` — each implements the `LuaTool` interface with `name`, `description`, `inputSchema` (zod), and `execute()`
- **Runtime APIs** (`User`, `Data`, `Products`, `Baskets`, `AI`, `Jobs`, `Templates`, `CDN`, `env`, `fetch`) are **sandbox globals** — do not import them from `lua-cli`
- **Bundling**: Each `execute` function is extracted and bundled separately by esbuild. Keep imports minimal inside `execute`.

## Development Commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Install Lua CLI | `npm install -g lua-cli` |
| Authenticate | `lua auth configure --api-key <key>` |
| Initialize agent (once) | `lua init --agent-name "Mindful Companion" --org-id <org-id>` |
| Test a single tool | `lua test skill --name <tool-name> --input '<json>'` |
| Test all tools quickly | `npm run test:all` |
| Chat with agent (sandbox) | `lua chat -e sandbox -m "<message>"` |
| Chat with agent (production) | `lua chat -e production -m "<message>"` |
| Push code to server | `lua push all --force` |
| Deploy to production | `lua deploy skill --name mindful-companion --set-version latest --force` |
| View logs | `lua logs --type skill --name mindful-companion --limit 20` |
| Push + deploy in one go | `lua push all --force --auto-deploy` |

## Critical Workflow Rules

1. **Test tools first, then chat**: `lua test` runs the `execute` function directly in a VM (fast, no AI). `lua chat` hits the full AI pipeline (slower). Iterate with `lua test`, validate with `lua chat`.
2. **Sandbox uses local code without push**: `lua chat -e sandbox` reads local compiled code from Redis cache. You do not need to `push`/`deploy` to test changes in sandbox.
3. **Push ≠ Deploy**: `lua push` uploads a version. `lua deploy` makes it live. Production uses the deployed version, not the latest push.
4. **One-way sync**: Server state cannot be pulled down to local. `lua init --agent-id` links to an existing agent but does not download its code.
5. **Use `--thread` for isolated tests**: `lua chat -e sandbox -m "..." -t <thread-id> --clear` prevents conversation state leaking between test runs.

## Tool Naming Convention

Tool names must match exactly in:
- The class: `name = 'log_mood'`
- The test command: `--name log_mood`
- The deploy command: `--name mindful-companion` (skill name, not individual tools)

Valid chars for tool/skill names: `a-z`, `A-Z`, `0-9`, `-`, `_`. No spaces or dots.

## Persistent State (User API)

The agent stores all user data via the `User` global:

```typescript
const user = await User.get();
user.moodHistory = [...];      // Array of {mood, note, timestamp}
user.currentMood = 7;          // Last logged mood
user.journal = [...];          // Array of journal entries
user.habits = { meditation: { streak, totalCompletions, ... } };
user.pomodoroStats = { totalSessions, totalFocusMinutes, currentStreak };
user.mindfulnessCount = 5;     // Total mindfulness sessions
user.affirmationCount = 10;    // Total affirmations received
await user.save();
```

**Key rule**: All user properties persist forever across conversations until explicitly overwritten. Use this for state machines, onboarding flows, and streak tracking.

## Environment Variables

- **Sandbox**: read from local `.env` file or CLI env vars
- **Production**: set via `lua env production -k KEY -v "value"`
- Access in tools: `env('KEY_NAME')` or `process.env.KEY_NAME`

## Common Gotchas

- **Empty bundles (< 100 bytes)**: Something went wrong during esbuild bundling. Check imports and syntax. Run `lua compile --debug` for verbose output.
- **"Could not resolve" errors**: Only standard TypeScript, `package.json` deps, and relative imports work inside `execute`. Node.js built-ins may not resolve.
- **Do not import runtime globals**: `User`, `Data`, `env`, `fetch`, etc. are sandbox globals — importing them from `lua-cli` will fail or be stripped.
- **Skill context matters**: The `context` field in `LuaSkill` is the primary signal for AI tool selection. Be explicit about when to use each tool.
- **No `git commit`/`push` unless asked**: This repo has a pre-existing git history. Do not mutate git state without explicit user confirmation.

## File Layout

```
src/
├── index.ts                          # Agent config + persona
├── skills/
│   └── MindfulCompanionSkill.ts      # Skill definition + tool wiring
└── tools/
    ├── MoodTrackingTool.ts           # log_mood, get_mood_history
    ├── JournalTool.ts                # write_journal, get_journal_entries
    ├── MindfulnessTool.ts            # mindfulness_exercise
    ├── PomodoroTool.ts               # start_pomodoro
    ├── HabitTrackingTool.ts          # track_habit, get_habit_streaks
    └── AffirmationTool.ts            # get_affirmation
```

## Cross-Platform Scripts

Shell scripts are provided for convenience but are not required:

| Script | macOS/Linux | Windows |
|--------|-------------|---------|
| Setup | `./setup.sh` | `setup.bat` |
| Chat | `./chat.sh [message]` | `chat.bat [message]` |
| Test | `./test.sh` | `test.bat` |
| Deploy | `./deploy.sh` | `deploy.bat` |
| Logs | `./logs.sh [type] [limit]` | `logs.bat [type] [limit]` |

All scripts are thin wrappers around `lua` CLI commands. When in doubt, use the `lua` commands directly — they are the source of truth.
