import { LuaTool } from 'lua-cli';
import { z } from 'zod';

export class WriteJournalTool implements LuaTool {
  name = 'write_journal';
  description = 'Write a reflective journal entry with optional AI-powered reflection prompts';

  inputSchema = z.object({
    entry: z.string().min(1).describe('Your journal entry text'),
    mood: z.number().min(1).max(10).optional().describe('Current mood when writing (1-10)'),
    tags: z.array(z.string()).optional().describe('Optional tags for the entry (e.g., ["gratitude", "work", "family"])')
  });

  async execute(input: z.infer<typeof this.inputSchema>) {
    const user = await User.get();
    
    // Initialize journal if not exists
    if (!user.journal) {
      user.journal = [];
    }
    
    // Generate reflection prompts based on entry content
    const reflectionPrompts = this.generateReflections(input.entry, input.mood);
    
    const journalEntry = {
      id: `entry_${Date.now()}`,
      entry: input.entry,
      mood: input.mood,
      tags: input.tags || [],
      reflectionPrompts,
      timestamp: new Date().toISOString()
    };
    
    user.journal.push(journalEntry);
    
    // Keep only last 50 entries
    if (user.journal.length > 50) {
      user.journal = user.journal.slice(-50);
    }
    
    await user.save();
    
    return {
      saved: true,
      entryId: journalEntry.id,
      wordCount: input.entry.split(' ').length,
      reflectionPrompts,
      message: "Your journal entry has been saved. Here are some reflections to consider:",
      timestamp: journalEntry.timestamp
    };
  }
  
  private generateReflections(entry: string, mood?: number): string[] {
    const prompts: string[] = [];
    const lowerEntry = entry.toLowerCase();
    
    // Gratitude detection
    if (lowerEntry.includes('grateful') || lowerEntry.includes('thankful') || lowerEntry.includes('appreciate')) {
      prompts.push('What specifically made you feel grateful today? Can you carry this feeling forward?');
    }
    
    // Challenge detection
    if (lowerEntry.includes('difficult') || lowerEntry.includes('hard') || lowerEntry.includes('struggle') || lowerEntry.includes('challenge')) {
      prompts.push('What did you learn from this challenge? How might it help you grow?');
      prompts.push('What would you tell a friend going through something similar?');
    }
    
    // Achievement detection
    if (lowerEntry.includes('achieved') || lowerEntry.includes('accomplished') || lowerEntry.includes('success') || lowerEntry.includes('proud')) {
      prompts.push('Take a moment to truly celebrate this win. You earned it!');
      prompts.push('What strengths did you use to achieve this? How can you apply them elsewhere?');
    }
    
    // Relationship detection
    if (lowerEntry.includes('friend') || lowerEntry.includes('family') || lowerEntry.includes('relationship') || lowerEntry.includes('love')) {
      prompts.push('How did this interaction make you feel? What does it reveal about what you value?');
    }
    
    // Work/career detection
    if (lowerEntry.includes('work') || lowerEntry.includes('job') || lowerEntry.includes('career') || lowerEntry.includes('project')) {
      prompts.push('What aspects of your work felt most meaningful today?');
    }
    
    // Mood-based prompts
    if (mood && mood <= 4) {
      prompts.push('Even on difficult days, what\'s one small thing that brought a moment of peace?');
      prompts.push('Remember: this feeling is temporary. What has helped you through similar times before?');
    } else if (mood && mood >= 8) {
      prompts.push('What can you do to savor and extend this positive feeling?');
    }
    
    // Default prompts if none matched
    if (prompts.length === 0) {
      prompts.push('What was the most meaningful moment of your day?');
      prompts.push('If you could change one thing about today, what would it be?');
    }
    
    return prompts.slice(0, 3); // Max 3 prompts
  }
}

export class GetJournalEntriesTool implements LuaTool {
  name = 'get_journal_entries';
  description = 'Retrieve your past journal entries';

  inputSchema = z.object({
    limit: z.number().min(1).max(20).optional().default(5).describe('Number of entries to retrieve (1-20)'),
    tag: z.string().optional().describe('Filter by tag (e.g., "gratitude", "work")')
  });

  async execute(input: z.infer<typeof this.inputSchema>) {
    const user = await User.get();
    
    if (!user.journal || user.journal.length === 0) {
      return {
        hasEntries: false,
        message: "You haven't written any journal entries yet. Start by sharing your thoughts!"
      };
    }
    
    let entries = user.journal as Array<{
      id: string;
      entry: string;
      mood?: number;
      tags: string[];
      reflectionPrompts: string[];
      timestamp: string;
    }>;
    
    // Filter by tag if provided
    if (input.tag) {
      entries = entries.filter(e => e.tags.some(t => t.toLowerCase() === input.tag!.toLowerCase()));
    }
    
    // Get most recent entries
    const recentEntries = entries.slice(-input.limit).reverse();
    
    const formattedEntries = recentEntries.map(e => ({
      id: e.id,
      preview: e.entry.length > 100 ? e.entry.substring(0, 100) + '...' : e.entry,
      mood: e.mood,
      tags: e.tags,
      date: new Date(e.timestamp).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }));
    
    return {
      hasEntries: true,
      totalEntries: user.journal.length,
      showing: formattedEntries.length,
      filter: input.tag || null,
      entries: formattedEntries
    };
  }
}
