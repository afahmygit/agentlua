import { LuaSkill } from 'lua-cli';
import { LogMoodTool } from '../tools/MoodTrackingTool';
import { GetMoodHistoryTool } from '../tools/MoodTrackingTool';
import { WriteJournalTool } from '../tools/JournalTool';
import { GetJournalEntriesTool } from '../tools/JournalTool';
import { MindfulnessExerciseTool } from '../tools/MindfulnessTool';
import { StartPomodoroTool } from '../tools/PomodoroTool';
import { TrackHabitTool } from '../tools/HabitTrackingTool';
import { GetHabitStreaksTool } from '../tools/HabitTrackingTool';
import { GetAffirmationTool } from '../tools/AffirmationTool';

export class MindfulCompanionSkill extends LuaSkill {
  constructor() {
    super({
      name: 'mindful-companion',
      description: 'A wellness and productivity companion that tracks mood, habits, mindfulness, and focus sessions',
      context: `
This skill provides holistic wellness and productivity support through several interconnected tools.

Tool Usage:
- log_mood: Use when users express emotions, after mindfulness exercises, or during check-ins. Always ask for a 1-10 rating and optional note.
- get_mood_history: Use when users want to see patterns, trends, or reflect on their emotional journey over time.
- write_journal: Use when users want to reflect, process thoughts, or record meaningful moments. Offer AI-powered reflection prompts.
- get_journal_entries: Use when users want to review past entries or find specific reflections.
- mindfulness_exercise: Use when users mention stress, anxiety, need to relax, or request meditation/breathing exercises. Ask what type they prefer.
- start_pomodoro: Use when users mention work, studying, focus, or productivity. Explain the 25-minute focus + 5-minute break cycle.
- track_habit: Use when users complete a habit or want to log daily practices. Support multiple habits.
- get_habit_streaks: Use when users want to see progress, streaks, or motivation about their habits.
- get_affirmation: Use when users need encouragement, positivity, or at the start of the day. Personalize based on their current mood if known.

Guidelines:
- Always be warm and supportive, never clinical or robotic
- Adapt suggestions based on user's current mood state (stored in user data)
- Celebrate streaks and progress enthusiastically
- After a low mood log, gently suggest a mindfulness exercise or affirmation
- Keep mindfulness exercises simple and accessible (1-5 minutes)
- When starting pomodoro, explain the technique briefly for first-time users
- Use the user's name when available for personalization
- Never give medical advice - suggest professional help for serious concerns
`,
      tools: [
        new LogMoodTool(),
        new GetMoodHistoryTool(),
        new WriteJournalTool(),
        new GetJournalEntriesTool(),
        new MindfulnessExerciseTool(),
        new StartPomodoroTool(),
        new TrackHabitTool(),
        new GetHabitStreaksTool(),
        new GetAffirmationTool(),
      ]
    });
  }
}
