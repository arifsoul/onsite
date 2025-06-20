import { SYSTEM_PROMPT } from '../config/systemPrompt.js';

// Dual-mode environment variable loading
let API_KEY;
try {
  // Primary mode: Try Vite's import.meta.env
  API_KEY = import.meta.env?.VITE_OPENROUTER_API_KEY;
  if (!API_KEY) {
    throw new Error('VITE_OPENROUTER_API_KEY is not defined in Vite environment variables.');
  }
} catch (viteError) {
  console.warn('Vite environment variable loading failed:', viteError.message);
  // Fallback mode: Try dotenv
  try {
    const { config } = await import('dotenv');
    config(); // Load .env file
    API_KEY = process.env.VITE_OPENROUTER_API_KEY;
    if (!API_KEY) {
      throw new Error('VITE_OPENROUTER_API_KEY is not defined in .env file.');
    }
  } catch (dotenvError) {
    console.error('Dotenv loading failed:', dotenvError.message);
    API_KEY = ''; // Final fallback to empty string
    console.error('Both Vite and dotenv failed to load API key. Using empty string as fallback.');
  }
}

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const LOCAL_BASE_URL = 'http://localhost:11434/v1';

// Main generateCode function
export const generateCode = async (prompt, stream = true, useLocalModel = true, onStreamChunk, signal) => {
  if (!prompt || prompt.trim() === '') {
    throw new Error('Prompt tidak boleh kosong.');
  }

  const headers = {
    'Content-Type': 'application/json',
  };

  headers['HTTP-Referer'] = 'http://localhost';
  headers['X-Title'] = 'Frontend Code Generator';

  let baseUrl, model;

  if (useLocalModel) {
    baseUrl = LOCAL_BASE_URL;
    model = 'deepseek-r1:7b';
    console.log(`🌐 Menggunakan lokal Ollama API (${model}, stream: ${stream})...`);
  } else {
    if (!API_KEY) {
      throw new Error('API key OpenRouter tidak ada. Silakan set VITE_OPENROUTER_API_KEY di .env.');
    }
    baseUrl = OPENROUTER_BASE_URL;
    model = 'deepseek/deepseek-r1:free';
    headers['Authorization'] = `Bearer ${API_KEY}`;
    console.log(`🌐 Mengirim permintaan ke OpenRouter API (model: ${model}, stream: ${stream})...`);
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          { role: 'user', content: prompt },
        ],
        extra_body: {
          include_reasoning: true,
        },
        stream,
        temperature: 0.5,
        max_tokens: 8192,
      }),
      signal, // Pass AbortController signal
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response from API:', errorData);
      throw new Error(errorData.error?.message || `Kesalahan HTTP! status: ${response.status}`);
    }

    if (stream) {
      console.log('📡 Mulai streaming konten...');
      const reader = response.body.getReader();
      let content = ''; // Menyimpan konten final
      let reasoning = ''; // Menyimpan reasoning
      let buffer = ''; // Buffer sementara untuk memproses chunk
      let jsonBuffer = ''; // Buffer untuk JSON chunks
      let isReasoningBlock = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          // Proses buffer yang tersisa hanya jika belum diproses
          if (buffer && onStreamChunk) {
            onStreamChunk(buffer); // Kirim buffer terakhir ke callback
          }
          console.log(`✅ Streaming selesai. Total panjang konten: ${content.length} karakter`);
          console.log('════════════════════════════════════════════');
          break;
        }
        if (value) {
          const chunk = new TextDecoder().decode(value);
          jsonBuffer += chunk; // Tambahkan ke buffer JSON

          // Proses setiap baris
          const lines = jsonBuffer.split('\n');
          jsonBuffer = lines.pop(); // Simpan baris terakhir (mungkin belum lengkap)

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.replace(/^data: /, '').trim();
              if (jsonStr === '[DONE]') continue;

              try {
                const parsed = JSON.parse(jsonStr);
                const contentFragment = parsed.choices?.[0]?.delta?.content;
                const reasoningFragment = useLocalModel
                  ? parsed.choices?.[0]?.delta?.content?.match(/<think>(.*?)<\/think>/)?.[1]
                  : parsed.choices?.[0]?.delta?.reasoning;

                if (contentFragment) {
                  content += contentFragment;
                  buffer += contentFragment;

                  // Deteksi tag <think> untuk Ollama lokal
                  if (useLocalModel && contentFragment.includes('<think>')) {
                    isReasoningBlock = true;
                  }

                  // Kirim fragmen ke callback, dengan warna biru untuk reasoning
                  if (onStreamChunk) {
                    if (isReasoningBlock || (!useLocalModel && reasoningFragment)) {
                      onStreamChunk(`\x1b[34m${contentFragment}\x1b[0m`);
                    } else {
                      onStreamChunk(contentFragment);
                    }
                  }

                  // Akhiri reasoning block saat menemukan </think>
                  if (useLocalModel && contentFragment.includes('</think>')) {
                    isReasoningBlock = false;
                  }

                  // Proses buffer jika ada akhir paragraf
                  if (buffer.match(/[.?!]\s*$/) || buffer.includes('\n\n')) {
                    buffer = '';
                  }
                }

                // Proses reasoningFragment jika ada (untuk API)
                if (reasoningFragment) {
                  reasoning += reasoningFragment;
                  if (onStreamChunk) {
                    // Tulis reasoning dengan warna biru
                    onStreamChunk(`\x1b[34m${reasoningFragment}\x1b[0m`);
                  }
                }
              } catch (e) {
                console.error('Error parsing chunk:', jsonStr, e);
                // Simpan jsonStr yang gagal ke jsonBuffer untuk dicoba lagi
                jsonBuffer = jsonStr + '\n' + jsonBuffer;
              }
            }
          }
        }
      }
      return { data: content, reasoning };
    } else {
      console.log('📥 Menerima respons non-stream...');
      const result = await response.json();
      console.log('Non-stream response:', result);
      const content = result.choices[0]?.message?.content;
      const reasoning = useLocalModel
        ? result.choices[0]?.message?.content?.match(/<think>(.*?)<\/think>/)?.[1] || 'Tidak ada reasoning ditemukan'
        : result.choices[0]?.message?.reasoning || 'Tidak ada reasoning ditemukan';
      if (!content) {
        throw new Error('Respons dari API tidak valid: Tidak ada konten ditemukan.');
      }
      console.log(`\x1b[34m💡 Reasoning: ${reasoning}\x1b[0m`);
      return { data: content, reasoning };
    }
  } catch (error) {
    console.error('Kesalahan API:', {
      message: error.message,
      stack: error.stack,
    });
    if (error.message.includes('429')) {
      throw new Error('Kuota API terlampaui. Coba lagi nanti.');
    }
    throw error; // Re-throw the error for handling in AIGenerator.jsx
  }
};