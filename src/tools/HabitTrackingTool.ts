import { LuaTool } from 'lua-cli';
import { z } from 'zod';

export class TrackHabitTool implements LuaTool {
  name = 'track_habit';
  description = 'Log a habit completion for today';

  inputSchema = z.object({
    habitName: z.string().min(1).describe('Name of the habit (e.g., "meditation", "reading", "exercise")'),
    note: z.string().optional().describe('Optional note about this completion')
  });

  async execute(input: z.infer<typeof this.inputSchema>) {
    const user = await User.get();
    
    // Initialize habits if not exists
    if (!user.habits) {
      user.habits = {};
    }
    
    const habits = user.habits as Record<string, {
      streak: number;
      totalCompletions: number;
      lastCompleted: string | null;
      history: Array<{ date: string; note?: string }>;
      createdAt: string;
    }>;
    
    const habitKey = input.habitName.toLowerCase().trim();
    
    // Initialize new habit
    if (!habits[habitKey]) {
      habits[habitKey] = {
        streak: 0,
        totalCompletions: 0,
        lastCompleted: null,
        history: [],
        createdAt: new Date().toISOString()
      };
    }
    
    const habit = habits[habitKey];
    const today = new Date().toDateString();
    const lastDate = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;
    
    // Check if already completed today
    if (lastDate === today) {
      return {
        tracked: false,
        alreadyCompleted: true,
        habitName: input.habitName,
        message: `You've already logged "${input.habitName}" today! Great consistency!`,
        currentStreak: habit.streak,
        totalCompletions: habit.totalCompletions
      };
    }
    
    // Update streak
    if (lastDate) {
      const lastDateObj = new Date(habit.lastCompleted!);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDateObj.toDateString() === yesterday.toDateString()) {
        habit.streak += 1;
      } else if (lastDateObj.toDateString() !== today) {
        // Streak broken
        habit.streak = 1;
      }
    } else {
      habit.streak = 1;
    }
    
    habit.totalCompletions += 1;
    habit.lastCompleted = new Date().toISOString();
    habit.history.push({
      date: new Date().toISOString(),
      note: input.note
    });
    
    // Keep only last 30 history entries
    if (habit.history.length > 30) {
      habit.history = habit.history.slice(-30);
    }
    
    await user.save();
    
    // Generate celebration message
    let celebration = '';
    if (habit.streak === 1) {
      celebration = 'First day! Every journey begins with a single step.';
    } else if (habit.streak === 3) {
      celebration = '3-day streak! You\'re building momentum!';
    } else if (habit.streak === 7) {
      celebration = 'A full week! That\'s amazing consistency!';
    } else if (habit.streak === 21) {
      celebration = '21 days! Research says habits form in 21 days - you might have just created a lasting change!';
    } else if (habit.streak === 30) {
      celebration = '30 days! A whole month of dedication. You\'re incredible!';
    } else if (habit.streak > 30) {
      celebration = `${habit.streak} days! You\'re absolutely crushing it!`;
    } else if (habit.streak >= 5) {
      celebration = `${habit.streak} days in a row! Keep that momentum going!`;
    } else {
      celebration = `${habit.streak} days strong!`;
    }
    
    return {
      tracked: true,
      habitName: input.habitName,
      currentStreak: habit.streak,
      totalCompletions: habit.totalCompletions,
      celebration,
      message: `Great job completing "${input.habitName}" today!`,
      note: input.note || null
    };
  }
}

export class GetHabitStreaksTool implements LuaTool {
  name = 'get_habit_streaks';
  description = 'View all your habit streaks and progress';

  inputSchema = z.object({
    sortBy: z.enum(['streak', 'name', 'recent']).optional().default('streak')
      .describe('Sort habits by: streak (longest first), name (alphabetical), or recent (most recently tracked)')
  });

  async execute(input: z.infer<typeof this.inputSchema>) {
    const user = await User.get();
    
    if (!user.habits || Object.keys(user.habits).length === 0) {
      return {
        hasHabits: false,
        message: "You haven't tracked any habits yet. Start by logging your first habit!",
        suggestions: ['meditation', 'reading', 'exercise', 'gratitude journaling', 'drinking water']
      };
    }
    
    const habits = user.habits as Record<string, {
      streak: number;
      totalCompletions: number;
      lastCompleted: string | null;
      history: Array<{ date: string; note?: string }>;
      createdAt: string;
    }>;
    
    // Format habits
    let habitList = Object.entries(habits).map(([key, habit]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      streak: habit.streak,
      totalCompletions: habit.totalCompletions,
      lastCompleted: habit.lastCompleted 
        ? new Date(habit.lastCompleted).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })
        : null,
      daysSinceLast: habit.lastCompleted 
        ? Math.floor((Date.now() - new Date(habit.lastCompleted).getTime()) / (1000 * 60 * 60 * 24))
        : null,
      isActiveToday: habit.lastCompleted 
        ? new Date(habit.lastCompleted).toDateString() === new Date().toDateString()
        : false
    }));
    
    // Sort
    switch (input.sortBy) {
      case 'streak':
        habitList.sort((a, b) => b.streak - a.streak);
        break;
      case 'name':
        habitList.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recent':
        habitList.sort((a, b) => {
          if (!a.daysSinceLast) return 1;
          if (!b.daysSinceLast) return -1;
          return a.daysSinceLast - b.daysSinceLast;
        });
        break;
    }
    
    // Calculate stats
    const totalHabits = habitList.length;
    const activeToday = habitList.filter(h => h.isActiveToday).length;
    const longestStreak = Math.max(...habitList.map(h => h.streak));
    const totalCompletionsAll = habitList.reduce((sum, h) => sum + h.totalCompletions, 0);
    
    // Find habits that need attention (not done today and streak > 0)
    const needsAttention = habitList.filter(h => !h.isActiveToday && h.streak > 0);
    
    return {
      hasHabits: true,
      totalHabits,
      activeToday,
      longestStreak,
      totalCompletionsAll,
      habits: habitList,
      needsAttention: needsAttention.map(h => h.name),
      message: activeToday === totalHabits 
        ? "All habits completed today! You're on fire!"
        : activeToday > 0
        ? `${activeToday} of ${totalHabits} habits done today. Keep going!`
        : "Let's get some habits checked off today!"
    };
  }
}
