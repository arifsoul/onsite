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
              'You are an AI that generates React component code (HTML, CSS, JS) based on user descriptions. Return structured JSON with html, css, js, and components array.',
          },
          { role: 'user', content: prompt },
        ],
        stream: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error('DeepSeek API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      error.response?.data?.error?.message || 'Failed to generate code. Please check API key and network.'
    );
  }
};