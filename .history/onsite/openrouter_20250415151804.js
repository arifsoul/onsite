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