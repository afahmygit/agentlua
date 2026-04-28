import { LuaTool } from 'lua-cli';
import { z } from 'zod';

export class LogMoodTool implements LuaTool {
  name = 'log_mood';
  description = 'Log your current mood on a scale of 1-10 with an optional note';

  inputSchema = z.object({
    mood: z.number().min(1).max(10).describe('Mood rating from 1 (very low) to 10 (excellent)'),
    note: z.string().optional().describe('Optional note about why you feel this way')
  });

  async execute(input: z.infer<typeof this.inputSchema>) {
    const user = await User.get();
    
    // Initialize mood history if not exists
    if (!user.moodHistory) {
      user.moodHistory = [];
    }
    
    const entry = {
      mood: input.mood,
      note: input.note || '',
      timestamp: new Date().toISOString()
    };
    
    user.moodHistory.push(entry);
    
    // Keep only last 30 entries
    if (user.moodHistory.length > 30) {
      user.moodHistory = user.moodHistory.slice(-30);
    }
    
    // Update current mood
    user.currentMood = input.mood;
    user.lastMoodCheck = new Date().toISOString();
    
    await user.save();
    
    // Generate personalized response based on mood
    let message = '';
    let suggestion = '';
    
    if (input.mood >= 8) {
      message = `That's wonderful! A ${input.mood}/10 is fantastic!`;
      suggestion = 'Consider writing in your journal about what\'s going well today.';
    } else if (input.mood >= 5) {
      message = `Thanks for sharing. A ${input.mood}/10 is a solid place to be.`;
      suggestion = 'A quick mindfulness exercise might help you feel even better.';
    } else if (input.mood >= 3) {
      message = `I hear you. A ${input.mood}/10 sounds tough.`;
      suggestion = 'Would you like to try a calming breathing exercise? It can help shift your state.';
    } else {
      message = `I'm really sorry you're feeling this way. A ${input.mood}/10 is hard.`;
      suggestion = 'Please consider reaching out to someone you trust. I\'m here to support you with a mindfulness exercise or just to listen.';
    }
    
    return {
      logged: true,
      mood: input.mood,
      message,
      suggestion,
      totalEntries: user.moodHistory.length,
      timestamp: entry.timestamp
    };
  }
}

export class GetMoodHistoryTool implements LuaTool {
  name = 'get_mood_history';
  description = 'View your mood history and trends over time';

  inputSchema = z.object({
    days: z.number().min(1).max(30).optional().default(7).describe('Number of days of history to retrieve (1-30)')
  });

  async execute(input: z.infer<typeof this.inputSchema>) {
    const user = await User.get();
    
    if (!user.moodHistory || user.moodHistory.length === 0) {
      return {
        hasHistory: false,
        message: "You haven't logged any moods yet. Start by sharing how you're feeling today!"
      };
    }
    
    const history = user.moodHistory as Array<{mood: number; note: string; timestamp: string}>;
    const recentHistory = history.slice(-input.days);
    
    // Calculate statistics
    const moods = recentHistory.map(h => h.mood);
    const average = moods.reduce((a, b) => a + b, 0) / moods.length;
    const highest = Math.max(...moods);
    const lowest = Math.min(...moods);
    
    // Detect trend
    let trend = 'stable';
    if (moods.length >= 3) {
      const firstHalf = moods.slice(0, Math.floor(moods.length / 2));
      const secondHalf = moods.slice(Math.floor(moods.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      
      if (secondAvg > firstAvg + 0.5) trend = 'improving';
      else if (secondAvg < firstAvg - 0.5) trend = 'declining';
    }
    
    // Format entries for display
    const formattedEntries = recentHistory.map(h => ({
      mood: h.mood,
      note: h.note,
      date: new Date(h.timestamp).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
    }));
    
    return {
      hasHistory: true,
      daysTracked: input.days,
      totalEntries: history.length,
      averageMood: Math.round(average * 10) / 10,
      highestMood: highest,
      lowestMood: lowest,
      trend,
      entries: formattedEntries,
      message: trend === 'improving' 
        ? "Your mood has been improving! Keep up the great work!"
        : trend === 'declining'
        ? "I've noticed your mood has been lower lately. Let's do something uplifting together."
        : "Your mood has been fairly steady. Consistency is good too!"
    };
  }
}
