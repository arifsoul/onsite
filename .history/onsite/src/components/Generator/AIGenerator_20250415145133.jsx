import { useState } from 'react';
import { generateCode } from '../../services/openrouterApi';

export default function AIGenerator() {
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async (prompt, retries = 2) => {
    if (!prompt || prompt.trim() === '') {
      throw new Error('Prompt cannot be empty.');
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await generateCode(prompt);
        console.log('Generated code:', result.data);
        return result;
      } catch (error) {
        console.error(`Attempt ${attempt} - Generate Error:`, {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        if (error.response?.status === 429) {
          throw new Error('OpenRouter API quota exceeded. Try again later.');
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

  const handleSubmit = async () => {
    try {
      const result = await handleGenerate(prompt);
      // Tambahkan logika untuk menangani hasil, misalnya set ke state atau render
      console.log('Result:', result.data);
    } catch (error) {
      console.error('Error:', error.message);
      // Tambahkan UI feedback, misalnya alert atau toast
    }
  };

  return (
    <div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your React component (e.g., Create a blue button)"
        rows={5}
        cols={50}
        style={{ resize: 'vertical', padding: '10px', fontSize: '16px' }}
      />
      <br />
      <button onClick={handleSubmit}>Generate</button>
    </div>
  );
}