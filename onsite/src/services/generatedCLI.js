import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const prompts = require('prompts');
import { generateCode } from './generatorAPI.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('Starting CLI script...');

async function runCLI() {
  console.log('Preparing to prompt user...');
  try {
    const response = await prompts([
      {
        type: 'text',
        name: 'prompt',
        message: 'Enter your prompt for code generation:',
        validate: (value) => (value.trim() ? true : 'Prompt cannot be empty.'),
      },
      {
        type: 'select',
        name: 'apiMode',
        message: 'Select API mode:',
        choices: [
          { title: 'Local (Ollama)', value: 'local' },
          { title: 'API (OpenRouter)', value: 'api' },
        ],
        initial: 0,
      },
    ]);

    console.log('Prompt response:', response);

    if (!response.prompt) {
      console.error('No prompt provided. Exiting...');
      process.exit(1);
    }

    const useLocalModel = response.apiMode === 'local';

    console.log(
      `Generating code for prompt: "${response.prompt}" with API mode: "${response.apiMode}"...`
    );

    const handleStreamChunk = (chunk) => {
      process.stdout.write(chunk); // Print chunk in real-time
    };

    await generateCode(
      response.prompt,
      true,
      useLocalModel,
      handleStreamChunk
    );
  } catch (error) {
    console.error('Error generating code:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

console.log('Executing runCLI...');
runCLI().catch((err) => {
  console.error('Unexpected error in runCLI:', err.message);
  process.exit(1);
});