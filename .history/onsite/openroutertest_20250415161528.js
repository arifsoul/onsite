import axios from 'axios';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

const API_KEY = process.env.VITE_OPENROUTER_API_KEY;
const BASE_URL = 'https://openrouter.ai/api/v1';

const generateCode = async (prompt) => {
  if (!API_KEY) {
    throw new Error('OpenRouter API key is missing. Please set VITE_OPENROUTER_API_KEY in .env.');
  }

  if (!prompt || prompt.trim() === '') {
    throw new Error('Prompt cannot be empty.');
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/chat/completions`,
      {
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
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
          'HTTP-Referer': 'http://localhost',
          'X-Title': 'React Code Generator',
        },
      }
    );

    const result = response.data.choices[0]?.message?.content;
    if (!result) {
      throw new Error('Invalid response from OpenRouter API: No content found.');
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(result);
    } catch (parseError) {
      throw new Error('Failed to parse API response as JSON.');
    }

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
      error.response?.data?.error?.message ||
        error.message ||
        'Failed to generate code. Please check API key and network.'
    );
  }
};

// Ambil prompt dari command line argumen
const prompt = process.argv.slice(2).join(' ');

if (!prompt) {
  console.error('Usage: node openroutertest.js "your prompt here"');
  process.exit(1);
}

// Jalankan
generateCode(prompt)
  .then((result) => {
    console.log('Generated Code:');
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((err) => {
    console.error('Error:', err.message);
  });
