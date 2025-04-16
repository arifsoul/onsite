import axios from 'axios';
import dotenv from 'dotenv';
import readline from 'readline';

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
    console.log('🌐 Sending request to API...');
    const response = await axios.post(
      `${BASE_URL}/chat/completions`,
      {
        model: 'deepseek/deepseek-r1',
        messages: [
          {
            role: 'system',
            content:
              'You are an AI that generates React component code for a portfolio website based on user descriptions. Return structured JSON with fields: jsx, css, js, and components array listing sub-components (e.g., ["Header", "About", "Projects", "Contact", "Footer"]). Example: ```json\n{"jsx": "<div>...</div>", "css": ".class { ... }", "js": "import React from \'react\'; function Component() { return <div>...</div>; }", "components": ["Header", "Footer"]}\n```. Ensure the code includes portfolio-specific sections like About, Projects, and Contact.',
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
          'X-Title': 'Portfolio Code Generator',
        },
      }
    );

    const result = response.data.choices[0]?.message?.content;
    if (!result) {
      throw new Error('Invalid response from OpenRouter API: No content found.');
    }

    console.log('🧹 Cleaning API response...');
    let cleanedResult = result.trim();

    if (cleanedResult.startsWith('```json')) {
      cleanedResult = cleanedResult.replace(/^```json/, '').replace(/```$/, '').trim();
    }
    console.log('✅ Cleaned response ready for parsing.');

    const parseJsonAsync = async (data) => {
      return new Promise((resolve, reject) => {
        console.log('📜 Parsing JSON...');
        try {
          const parsed = JSON.parse(data);
          console.log('🎉 JSON parsed successfully!');
          resolve(parsed);
        } catch (error) {
          console.error('❌ JSON parsing failed!');
          reject(error);
        }
      });
    };

    let parsedResult;
    try {
      parsedResult = await parseJsonAsync(cleanedResult);
    } catch (parseError) {
      console.error('Failed to parse cleaned API response as JSON:', cleanedResult);
      throw new Error('Failed to parse cleaned API response as JSON.');
    }

    if (!parsedResult.jsx || !parsedResult.css || !parsedResult.js) {
      throw new Error('API response missing required fields (jsx, css, js).');
    }

    return {
      data: {
        jsx: parsedResult.jsx,
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

// Create readline interface for real-time prompt input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const promptUser = () => {
  rl.question('Enter your prompt (or type "exit" to quit): ', async (prompt) => {
    if (prompt.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    try {
      console.log('🚀 Generating code...');
      const result = await generateCode(prompt);
      console.log('✅ Generated Portfolio Code:');
      console.log('JSX:\n', result.data.jsx);
      console.log('CSS:\n', result.data.css);
      console.log('JS:\n', result.data.js);
      console.log('Components:', result.data.components);
    } catch (err) {
      console.error('❌ Error:', err.message);
    }

    promptUser();
  });
};

// Start the prompt loop
console.log('Welcome to Portfolio Code Generator CLI');
promptUser();