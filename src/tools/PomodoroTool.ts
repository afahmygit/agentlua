import { LuaTool } from 'lua-cli';
import { z } from 'zod';

export class StartPomodoroTool implements LuaTool {
  name = 'start_pomodoro';
  description = 'Start a Pomodoro focus session with mindful breaks';

  inputSchema = z.object({
    task: z.string().min(1).describe('What you want to focus on during this session'),
    duration: z.number().min(5).max(60).optional().default(25).describe('Focus duration in minutes (5-60, default 25)'),
    breakDuration: z.number().min(1).max(30).optional().default(5).describe('Break duration in minutes (1-30, default 5)')
  });

  async execute(input: z.infer<typeof this.inputSchema>) {
    const user = await User.get();
    
    // Track pomodoro stats
    if (!user.pomodoroStats) {
      user.pomodoroStats = {
        totalSessions: 0,
        totalFocusMinutes: 0,
        currentStreak: 0,
        lastSessionDate: null
      };
    }
    
    const stats = user.pomodoroStats as {
      totalSessions: number;
      totalFocusMinutes: number;
      currentStreak: number;
      lastSessionDate: string | null;
    };
    
    // Check if this continues a daily streak
    const today = new Date().toDateString();
    const lastDate = stats.lastSessionDate ? new Date(stats.lastSessionDate).toDateString() : null;
    
    if (lastDate === today) {
      // Same day, increment streak
      stats.currentStreak += 1;
    } else if (lastDate) {
      const lastDateObj = new Date(stats.lastSessionDate!);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDateObj.toDateString() === yesterday.toDateString()) {
        // Continued from yesterday
        stats.currentStreak += 1;
      } else {
        // Streak broken
        stats.currentStreak = 1;
      }
    } else {
      stats.currentStreak = 1;
    }
    
    stats.totalSessions += 1;
    stats.totalFocusMinutes += input.duration;
    stats.lastSessionDate = new Date().toISOString();
    
    // Store current session
    user.currentPomodoro = {
      task: input.task,
      duration: input.duration,
      breakDuration: input.breakDuration,
      startedAt: new Date().toISOString(),
      status: 'active'
    };
    
    await user.save();
    
    // Generate session plan
    const focusEndTime = new Date(Date.now() + input.duration * 60000);
    const breakEndTime = new Date(focusEndTime.getTime() + input.breakDuration * 60000);
    
    return {
      started: true,
      task: input.task,
      focusDuration: input.duration,
      breakDuration: input.breakDuration,
      focusUntil: focusEndTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      breakUntil: breakEndTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      totalSessions: stats.totalSessions,
      currentStreak: stats.currentStreak,
      totalFocusHours: Math.round(stats.totalFocusMinutes / 60 * 10) / 10,
      message: `Pomodoro started! Focus on "${input.task}" for ${input.duration} minutes.`,
      tips: [
        'Put your phone on silent or in another room',
        'Close unnecessary browser tabs',
        'If a distracting thought arises, jot it down and return to focus',
        'When the break starts, step away from your screen'
      ],
      breakActivity: this.getBreakActivity(stats.currentStreak)
    };
  }
  
  private getBreakActivity(streak: number): string {
    const activities = [
      'Do some gentle neck rolls and shoulder stretches',
      'Look out a window at something far away to rest your eyes',
      'Take 5 deep breaths, focusing on the exhale',
      'Drink a glass of water mindfully',
      'Do a quick body scan from head to toe',
      'Step outside for fresh air if possible',
      'Do 10 jumping jacks or a quick stretch',
      'Close your eyes and listen to ambient sounds'
    ];
    
    // Pick based on streak to give variety
    return activities[streak % activities.length];
  }
}
