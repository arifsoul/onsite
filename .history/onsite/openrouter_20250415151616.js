import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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',
  defaultHeaders: {
    'HTTP-Referer': 'http://your-site.com',
    'X-Title': 'Your Site Name',
  },
});

async function main() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o', // Verify this model is supported
      messages: [
        {
          role: 'user',
          content: 'What is the meaning of life?',
        },
      ],
    });
    console.log('Full completion:', completion);
    if (completion.choices && completion.choices.length > 0) {
      console.log(completion.choices[0].message);
    } else {
      console.log('No choices returned in response');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();