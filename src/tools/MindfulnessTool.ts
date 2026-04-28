import { LuaTool } from 'lua-cli';
import { z } from 'zod';

export class MindfulnessExerciseTool implements LuaTool {
  name = 'mindfulness_exercise';
  description = 'Get a guided mindfulness or breathing exercise';

  inputSchema = z.object({
    type: z.enum(['breathing', 'body_scan', 'gratitude', 'letting_go', 'five_senses']).optional().default('breathing')
      .describe('Type of exercise: breathing, body_scan, gratitude, letting_go, or five_senses'),
    duration: z.enum(['short', 'medium', 'long']).optional().default('short')
      .describe('Duration: short (1-2 min), medium (3-5 min), long (5-10 min)')
  });

  async execute(input: z.infer<typeof this.inputSchema>) {
    const exercises: Record<string, Record<string, { title: string; steps: string[]; closing: string }>> = {
      breathing: {
        short: {
          title: '4-7-8 Calming Breath',
          steps: [
            'Find a comfortable position and close your eyes.',
            'Breathe in quietly through your nose for 4 counts.',
            'Hold your breath gently for 7 counts.',
            'Exhale completely through your mouth for 8 counts.',
            'Repeat this cycle 3 more times.',
            'Notice how your body feels calmer with each breath.'
          ],
          closing: 'You can use this technique anytime you need to calm your nervous system. Great work!'
        },
        medium: {
          title: 'Box Breathing for Focus',
          steps: [
            'Sit comfortably with your feet flat on the floor.',
            'Inhale slowly through your nose for 4 counts.',
            'Hold your breath for 4 counts.',
            'Exhale slowly through your mouth for 4 counts.',
            'Hold empty for 4 counts.',
            'Continue this box pattern for 5 minutes.',
            'If your mind wanders, gently bring it back to the counting.',
            'Notice the rhythm and steadiness of your breath.'
          ],
          closing: 'Box breathing is used by athletes and Navy SEALs to stay calm under pressure. You just did it!'
        },
        long: {
          title: 'Deep Diaphragmatic Breathing',
          steps: [
            'Lie down or sit comfortably with one hand on your chest and one on your belly.',
            'Take a slow breath in through your nose, feeling your belly rise (not your chest).',
            'Exhale slowly through pursed lips, feeling your belly fall.',
            'Continue for 10 deep breaths, focusing on the belly movement.',
            'Now let your breathing return to normal and just observe it.',
            'Scan your body from head to toe, noticing any areas of tension.',
            'With each exhale, imagine releasing tension from those areas.',
            'Stay with this awareness for a few more minutes.'
          ],
          closing: 'Diaphragmatic breathing activates your parasympathetic nervous system, promoting deep relaxation.'
        }
      },
      body_scan: {
        short: {
          title: 'Quick Body Check-In',
          steps: [
            'Close your eyes and take a deep breath.',
            'Notice your feet - any tension? Wiggle your toes.',
            'Move awareness to your hands - are they clenched? Open them.',
            'Check your shoulders - roll them back and down.',
            'Notice your jaw - unclench if needed.',
            'Take one more deep breath and release.'
          ],
          closing: 'This quick scan helps you catch and release physical tension throughout the day.'
        },
        medium: {
          title: 'Full Body Scan',
          steps: [
            'Lie down comfortably and close your eyes.',
            'Start at the top of your head. Notice any sensations.',
            'Slowly move down to your forehead, eyes, jaw, and neck.',
            'Continue to your shoulders, arms, and hands.',
            'Move to your chest, back, and belly.',
            'Scan your hips, legs, and feet.',
            'If you find tension, breathe into that area and release.',
            'Take a moment to feel your whole body at rest.'
          ],
          closing: 'Regular body scans increase your awareness of how emotions show up physically.'
        },
        long: {
          title: 'Deep Body Awareness Practice',
          steps: [
            'Settle into a comfortable lying position.',
            'Begin at your crown. Spend 30 seconds just feeling this area.',
            'Move to your face - forehead, eyes, cheeks, jaw, tongue.',
            'Travel down your neck and throat.',
            'Spend time with your shoulders, noticing if they\'re holding weight.',
            'Move through your arms, elbows, wrists, and each finger.',
            'Feel your chest rise and fall with each breath.',
            'Notice your belly, lower back, and hips.',
            'Scan your thighs, knees, calves, and feet.',
            'Now feel your entire body as one connected whole.',
            'Rest in this awareness for a few minutes.'
          ],
          closing: 'This practice builds deep connection between mind and body. Well done.'
        }
      },
      gratitude: {
        short: {
          title: 'Three Good Things',
          steps: [
            'Take a deep breath and settle in.',
            'Think of one thing that went well today.',
            'Think of one person you\'re grateful for.',
            'Think of one small pleasure you experienced.',
            'Hold these three things in your mind for a moment.',
            'Notice how gratitude feels in your body.'
          ],
          closing: 'Research shows this simple practice increases happiness and reduces depression.'
        },
        medium: {
          title: 'Gratitude Meditation',
          steps: [
            'Sit comfortably and close your eyes.',
            'Bring to mind someone who has helped you.',
            'Visualize their face and feel gratitude in your heart.',
            'Silently thank them for their kindness.',
            'Now think of a challenge you overcame.',
            'Feel grateful for your own strength and resilience.',
            'Finally, appreciate something simple - a warm drink, sunshine, or a smile.',
            'Let gratitude fill your whole being.'
          ],
          closing: 'Gratitude shifts your brain\'s focus from what\'s lacking to what\'s abundant.'
        },
        long: {
          title: 'Deep Gratitude Practice',
          steps: [
            'Find a quiet space and settle in comfortably.',
            'Begin with 5 deep breaths to center yourself.',
            'Reflect on your body - thank it for carrying you through life.',
            'Think of your senses - sight, hearing, touch, taste, smell. Appreciate each one.',
            'Bring to mind relationships that nourish you. Feel warmth for each person.',
            'Consider opportunities you\'ve had - education, experiences, chances to grow.',
            'Reflect on challenges that made you stronger. Be grateful for the lessons.',
            'Think of nature - the earth, sky, water that sustains you.',
            'Finally, appreciate yourself - your efforts, your heart, your presence.',
            'Sit with this fullness of gratitude for a few minutes.'
          ],
          closing: 'This practice rewires your brain for positivity and contentment. Beautiful work.'
        }
      },
      letting_go: {
        short: {
          title: 'Release and Relax',
          steps: [
            'Identify one thing you\'re holding tension about.',
            'Take a deep breath in.',
            'As you exhale, imagine releasing that tension.',
            'Say to yourself: "I release what I cannot control."',
            'Take two more breaths, letting go more each time.'
          ],
          closing: 'Letting go is not giving up - it\'s making space for peace.'
        },
        medium: {
          title: 'Letting Go Meditation',
          steps: [
            'Sit comfortably and close your eyes.',
            'Bring to mind something that\'s been weighing on you.',
            'Notice where you feel this in your body.',
            'Imagine placing this burden in a balloon.',
            'With each exhale, watch the balloon float higher.',
            'Feel the lightness as it drifts away.',
            'Rest in the space that\'s left behind.',
            'This space is peace. This space is yours.'
          ],
          closing: 'You don\'t have to carry everything. Some things are meant to be released.'
        },
        long: {
          title: 'Deep Release Practice',
          steps: [
            'Settle into a comfortable position.',
            'Scan your body for areas of tension or discomfort.',
            'For each area, identify what emotion or thought might be stored there.',
            'Begin with your shoulders - common place for responsibility and burden.',
            'Breathe into each tense area and consciously release it.',
            'Now turn to your mind - what thoughts loop repeatedly?',
            'Acknowledge each one without judgment, then let it pass like a cloud.',
            'Consider what you\'re trying to control that\'s outside your influence.',
            'Practice the mantra: "I control my actions. I release the outcomes."',
            'Rest in the freedom of this release.',
            'Notice how much lighter you feel.'
          ],
          closing: 'True strength includes knowing what to hold and what to release.'
        }
      },
      five_senses: {
        short: {
          title: '5-4-3-2-1 Grounding',
          steps: [
            'Look around and name 5 things you can see.',
            'Name 4 things you can physically feel.',
            'Name 3 things you can hear right now.',
            'Name 2 things you can smell.',
            'Name 1 thing you can taste.',
            'Take a deep breath. You are here. You are safe.'
          ],
          closing: 'This technique is excellent for anxiety and bringing you back to the present moment.'
        },
        medium: {
          title: 'Sensory Awareness Practice',
          steps: [
            'Sit comfortably and take 3 deep breaths.',
            'Spend 1 minute really looking at something beautiful near you.',
            'Close your eyes and listen to all the sounds around you for 1 minute.',
            'Notice what you can feel - chair, clothes, air on skin.',
            'If you have a snack or drink nearby, savor one bite or sip mindfully.',
            'Take a deep breath and notice any scents in the air.',
            'Reflect on how rich your sensory experience is right now.'
          ],
          closing: 'Our senses anchor us in the present moment, away from worries about past or future.'
        },
        long: {
          title: 'Deep Sensory Immersion',
          steps: [
            'Find a comfortable spot and settle in.',
            'Sight: Spend 2 minutes observing your surroundings in detail. Colors, shapes, light, shadows.',
            'Sound: Close your eyes for 2 minutes. Notice layers of sound - near, far, constant, intermittent.',
            'Touch: Feel 3 different textures. Notice temperature, pressure, smoothness.',
            'Smell: Take deep breaths through your nose. What do you notice?',
            'Taste: If you have something, eat it slowly. If not, just notice your mouth.',
            'Now combine all senses. Experience this moment fully.',
            'Rest in pure awareness for a few minutes.'
          ],
          closing: 'When we fully inhabit our senses, we inhabit the present. This is where life happens.'
        }
      }
    };

    const exercise = exercises[input.type][input.duration];
    
    // Track that user did a mindfulness exercise
    const user = await User.get();
    if (!user.mindfulnessCount) {
      user.mindfulnessCount = 0;
    }
    user.mindfulnessCount += 1;
    user.lastMindfulness = new Date().toISOString();
    await user.save();
    
    return {
      title: exercise.title,
      type: input.type,
      duration: input.duration,
      steps: exercise.steps,
      closing: exercise.closing,
      totalSessions: user.mindfulnessCount,
      message: `Let's begin your ${input.duration} ${input.type.replace('_', ' ')} exercise. Take your time with each step.`
    };
  }
}
