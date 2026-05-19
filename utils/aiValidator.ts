import OpenAI from 'openai';

export type DreamClassification = 'Good' | 'Bad';

const VALID_CLASSIFICATIONS: DreamClassification[] = ['Good', 'Bad'];

function isDreamClassification(value: string): value is DreamClassification {
  return VALID_CLASSIFICATIONS.includes(value as DreamClassification);
}

function fallbackClassifyDream(dreamName: string): DreamClassification {
  const badDreamKeywords = ['lost', 'late', 'monster', 'chase', 'maze', 'exam', 'fear'];
  const normalizedDreamName = dreamName.toLowerCase();

  return badDreamKeywords.some((keyword) => normalizedDreamName.includes(keyword)) ? 'Bad' : 'Good';
}

export async function classifyDream(dreamName: string): Promise<DreamClassification> {
  const trimmedDreamName = dreamName.trim();

  if (!trimmedDreamName) {
    return 'Bad';
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return fallbackClassifyDream(trimmedDreamName);
  }

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: 'gpt-5-mini',
      instructions: [
        'You are a dream classifier.',
        '',
        'Classify dream titles only into:',
        'Good',
        'Bad',
        '',
        'Rules:',
        '- Return exactly one word',
        '- No explanation',
        '- No punctuation',
        '- No extra text',
      ].join('\n'),
      input: `Dream name: ${trimmedDreamName}`,
    });

    const classification = response.output_text.trim();

    if (isDreamClassification(classification)) {
      return classification;
    }

    return fallbackClassifyDream(trimmedDreamName);
  } catch (error) {
    console.warn(`AI dream classification failed. Falling back to local classification. ${String(error)}`);
    return fallbackClassifyDream(trimmedDreamName);
  }
}
