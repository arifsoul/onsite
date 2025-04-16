import axios from 'axios';

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const BASE_URL = 'https://api.deepseek.com';

export const generateCode = async (prompt) => {
  if (!API_KEY) {
    throw new Error('DeepSeek API key is missing. Please set VITE_DEEPSEEK_API_KEY in .env.');
  }

  if (!prompt || prompt.trim() === '') {
    throw new Error('Prompt cannot be empty.');
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/chat/completions`,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content:
              'You are an AI that generates React component code based on user descriptions. Return structured JSON with fields: html, css, js, and components array. Example: ```json\n{"html": "<div>...</div>", "css": ".class {...}", "js": "function ...", "components": []}\n```',
          },
          { role: 'user', content: prompt },
        ],
        stream: false,
        temperature: 0.7, // Tambahkan untuk kontrol kreativitas
        max_tokens: 4096, // Sesuaikan dengan kebutuhan
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    // Parse response dari DeepSeek API
    const result = response.data.choices[0]?.message?.content;
    if (!result) {
      throw new Error('Invalid response from DeepSeek API: No content found.');
    }

    // Asumsi DeepSeek mengembalikan JSON string, parse ke object
    let parsedResult;
    try {
      parsedResult = JSON.parse(result);
    } catch (parseError) {
      throw new Error('Failed to parse API response as JSON.');
    }

    // Validasi struktur response
    if (!parsedResult.html || !parsedResult.css || !parsedResult.js) {
      throw new Error('API response missing required fields (html, css, js).');
    }

    return { data: { 
      html: parsedResult.html, 
      css: parsedResult.css, 
      js: parsedResult.js, 
      components: parsedResult.components || [] 
    }};
  } catch (error) {
    console.error('DeepSeek API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      error.response?.data?.error?.message || error.message || 'Failed to generate code. Please check API key and network.'
    );
  }
};