import axios from 'axios';

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const BASE_URL = 'https://api.deepseek.com';

export const generateCode = async (prompt) => {
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
    throw new Error('Failed to generate code');
  }
};