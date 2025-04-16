import OpenAI from 'openai';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const BASE_URL = 'https://openrouter.ai/api/v1';

const openai = new OpenAI({
  baseURL: BASE_URL,
  apiKey: API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost', // Ganti dengan URL situsmu jika di-deploy
    'X-Title': 'React Code Generator', // Ganti dengan nama aplikasi
  },
});

export const generateCode = async (prompt) => {
  if (!API_KEY) {
    throw new Error('OpenRouter API key is missing. Please set VITE_OPENROUTER_API_KEY in .env.');
  }

  if (!prompt || prompt.trim() === '') {
    throw new Error('Prompt cannot be empty.');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-r1',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI that generates React component code based on user descriptions. Return structured JSON with fields: html, css, js, and components array. Example: ```json\n{"html": "<div>...</div>", "css": ".class {...}", "js": "function ...", "components": []}\n```',
        },
        { role: 'user', content: prompt },
      ],
      stream: false,
      temperature: 0.7,
      max_tokens: 4096,
    });

    // Parse respons dari OpenRouter API
    const result = completion.choices[0]?.message?.content;
    if (!result) {
      throw new Error('Invalid response from OpenRouter API: No content found.');
    }

    // Asumsi respons adalah JSON string, parse ke object
    let parsedResult;
    try {
      parsedResult = JSON.parse(result);
    } catch (parseError) {
      throw new Error('Failed to parse API response as JSON.');
    }

    // Validasi struktur respons
    if (!parsedResult.html || !parsedResult.css || !parsedResult.js) {
      throw new Error('API response missing required fields (html, css, js).');
    }

    return {
      data: {
        html: parsedResult.html,
        css: parsedResult.css,
        js: parsedResult.js,
        components: parsedResult.components || [],
      },
    };
  } catch (error) {
    console.error('OpenRouter API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    if (error.response?.status === 429) {
      throw new Error('OpenRouter API quota exceeded. Try again later.');
    }
    throw new Error(
      error.response?.data?.error?.message || error.message || 'Failed to generate code. Please check API key and network.'
    );
  }
};