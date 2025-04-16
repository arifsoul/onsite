import React, { useState } from 'react';
import { generateCode } from '/src/services/openrouterApi.js'; // Pastikan path dan ekspor benar

const AIGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedCode, setGeneratedCode] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setGeneratedCode(null);
    try {
      const result = await generateCode(prompt); // Memanggil fungsi generateCode
      setGeneratedCode(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>AI Code Generator</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the React component you want to generate..."
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Code'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {generatedCode && (
        <div>
          <h3>Generated Code</h3>
          <pre>{JSON.stringify(generatedCode, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AIGenerator;