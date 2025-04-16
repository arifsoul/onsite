import { useState } from 'react';
import { generateCode } from '../../services/openrouterApi';

export default function AIGenerator() {
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async (prompt) => {
    try {
      const result = await generateCode(prompt);
      console.log('Generated code:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error generating code:', error.message);
      throw error;
    }
  };

  return (
    <div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your React component"
      />
      <button onClick={() => handleGenerate(prompt)}>Generate</button>
    </div>
  );
}