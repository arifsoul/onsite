import axios from 'axios';

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const BASE_URL = 'https://api.deepseek.com';

export const generateCode = async (prompt, retries = 2) => {
  if (!API_KEY) {
    throw new Error('DeepSeek API key is missing. Please set VITE_DEEPSEEK_API_KEY in .env.');
  }

  if (!prompt || prompt.trim() === '') {
    throw new Error('Prompt cannot be empty.');
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
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
          temperature: 0.7,
          max_tokens: 4096,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      const result = response.data.choices[0]?.message?.content;
      if (!result) {
        throw new Error('Invalid response from DeepSeek API: No content found.');
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
      console.error(`Attempt ${attempt} - DeepSeek API Error:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 402) {
        throw new Error(
          'DeepSeek API: Insufficient balance. Please top up your account at https://deepseek.com.'
        );
      }
      if (attempt === retries) {
        throw new Error(
          error.response?.data?.error?.message ||
            error.message ||
            'Failed to generate code. Please check API key and network.'
        );
      }
      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
};