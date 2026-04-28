import { LuaTool } from 'lua-cli';
import { z } from 'zod';

export class GetAffirmationTool implements LuaTool {
  name = 'get_affirmation';
  description = 'Get a personalized daily affirmation based on your mood and goals';

  inputSchema = z.object({
    category: z.enum([
      'confidence', 'calm', 'gratitude', 'resilience', 'self_love', 
      'motivation', 'mindfulness', 'general'
    ]).optional().default('general')
      .describe('Category of affirmation: confidence, calm, gratitude, resilience, self_love, motivation, mindfulness, or general'),
    count: z.number().min(1).max(5).optional().default(1)
      .describe('Number of affirmations to receive (1-5)')
  });

  async execute(input: z.infer<typeof this.inputSchema>) {
    const user = await User.get();
    
    // Get user's current mood if available
    const currentMood = user.currentMood as number | undefined;
    
    // Affirmation collections
    const affirmations: Record<string, string[]> = {
      confidence: [
        'I am capable of handling whatever comes my way today.',
        'My voice matters and my ideas have value.',
        'I trust myself to make the right decisions.',
        'I am worthy of success and happiness.',
        'Every challenge I face is an opportunity to grow stronger.',
        'I bring unique strengths and perspectives to every situation.',
        'I am enough, exactly as I am right now.',
        'My potential is limitless and I am constantly evolving.',
        'I choose to believe in myself, even when things feel uncertain.',
        'I have overcome challenges before, and I will do it again.'
      ],
      calm: [
        'I am grounded, peaceful, and centered.',
        'This moment is enough. I am enough.',
        'I release tension with every exhale.',
        'Peace begins with me, in this very moment.',
        'I choose calm over chaos, always.',
        'Like a deep lake, my inner peace remains undisturbed.',
        'I have the power to create stillness within myself.',
        'Each breath brings me deeper into tranquility.',
        'I am safe, I am supported, I am at peace.',
        'Nothing can disturb the calm center of my being.'
      ],
      gratitude: [
        'I am grateful for the abundance that surrounds me.',
        'Today, I choose to see the beauty in small things.',
        'My heart is full of appreciation for this moment.',
        'I am thankful for my journey, exactly as it is.',
        'Gratitude transforms what I have into enough.',
        'I appreciate the lessons hidden in every experience.',
        'My life is rich with blessings, both big and small.',
        'I am grateful for the gift of another day.',
        'Thankfulness opens my heart to joy.',
        'I choose to focus on what I have, not what I lack.'
      ],
      resilience: [
        'I am stronger than any obstacle in my path.',
        'Setbacks are setups for comebacks.',
        'I bend but I do not break.',
        'Every difficulty carries the seed of an equal benefit.',
        'I have survived 100% of my bad days so far.',
        'My resilience is forged in the fire of challenges.',
        'I rise, I adapt, I overcome.',
        'Tough times never last, but tough people do.',
        'I am building unshakeable strength with every challenge.',
        'This too shall pass, and I will emerge wiser.'
      ],
      self_love: [
        'I treat myself with the same kindness I offer others.',
        'I am worthy of love, especially my own.',
        'My imperfections make me beautifully human.',
        'I choose to be my own biggest supporter.',
        'I honor my needs and respect my boundaries.',
        'I am learning to love myself more each day.',
        'My worth is not determined by my productivity.',
        'I deserve rest, joy, and compassion.',
        'I am a work in progress, and that is perfectly okay.',
        'The relationship I have with myself sets the tone for all others.'
      ],
      motivation: [
        'I am focused, determined, and ready to take action.',
        'Small steps forward are still progress.',
        'I have everything I need to succeed right now.',
        'My goals are achievable and I am moving toward them.',
        'Today is a new opportunity to create something amazing.',
        'I am committed to my growth and my dreams.',
        'Progress, not perfection, is my goal.',
        'I choose to start before I feel ready.',
        'My effort today plants seeds for tomorrow\'s harvest.',
        'I am capable of more than I imagine.'
      ],
      mindfulness: [
        'I am fully present in this moment.',
        'My breath anchors me to the here and now.',
        'I observe my thoughts without judgment.',
        'This moment is a gift, and I am here to receive it.',
        'I release the past and future, embracing now.',
        'Awareness is the first step to transformation.',
        'I am exactly where I need to be.',
        'Each moment offers a fresh start.',
        'I choose to be conscious and intentional today.',
        'Stillness is not empty - it is full of answers.'
      ],
      general: [
        'Today is full of possibilities.',
        'I am exactly where I need to be on my journey.',
        'I choose peace over worry.',
        'My best is enough, and my best is pretty great.',
        'I am surrounded by love and support.',
        'Good things are coming my way.',
        'I radiate positivity and attract good energy.',
        'Every day is a fresh start.',
        'I am proud of how far I\'ve come.',
        'The universe conspires in my favor.',
        'I am becoming the best version of myself.',
        'Joy is my natural state.',
        'I trust the timing of my life.',
        'My presence is my power.',
        'I am creating a life I love.'
      ]
    };
    
    // Select category - if general, consider mood
    let selectedCategory = input.category;
    if (selectedCategory === 'general' && currentMood !== undefined) {
      if (currentMood <= 4) {
        selectedCategory = 'resilience';
      } else if (currentMood <= 6) {
        selectedCategory = 'calm';
      } else {
        selectedCategory = 'gratitude';
      }
    }
    
    const categoryAffirmations = affirmations[selectedCategory] || affirmations.general;
    
    // Get user's seen affirmations to avoid repetition
    if (!user.seenAffirmations) {
      user.seenAffirmations = {};
    }
    
    const seen = user.seenAffirmations as Record<string, number[]>;
    if (!seen[selectedCategory]) {
      seen[selectedCategory] = [];
    }
    
    // Select random affirmations, avoiding recent repeats
    const selected: string[] = [];
    const available = categoryAffirmations.map((a, i) => ({ text: a, index: i }));
    
    for (let i = 0; i < Math.min(input.count, available.length); i++) {
      // Filter out recently seen
      const notRecent = available.filter(a => !seen[selectedCategory].includes(a.index));
      const pool = notRecent.length > 0 ? notRecent : available;
      
      const randomIndex = Math.floor(Math.random() * pool.length);
      const chosen = pool[randomIndex];
      selected.push(chosen.text);
      
      // Mark as seen
      seen[selectedCategory].push(chosen.index);
      if (seen[selectedCategory].length > Math.floor(available.length * 0.7)) {
        seen[selectedCategory] = seen[selectedCategory].slice(-Math.floor(available.length * 0.3));
      }
      
      // Remove from available
      const removeIndex = available.findIndex(a => a.index === chosen.index);
      if (removeIndex > -1) available.splice(removeIndex, 1);
    }
    
    // Track affirmation stats
    if (!user.affirmationCount) {
      user.affirmationCount = 0;
    }
    user.affirmationCount += 1;
    user.lastAffirmation = new Date().toISOString();
    await user.save();
    
    return {
      affirmations: selected,
      category: selectedCategory,
      count: selected.length,
      totalAffirmationsReceived: user.affirmationCount,
      message: selected.length > 1 
        ? `Here are your ${selectedCategory.replace('_', ' ')} affirmations for today:`
        : `Your ${selectedCategory.replace('_', ' ')} affirmation for today:`,
      tip: 'Repeat these affirmations slowly, feeling the truth in each word. You can say them out loud or in your mind.'
    };
  }
}
