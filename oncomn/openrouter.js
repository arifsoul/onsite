import OpenAI from 'openai';
import dotenv from 'dotenv';

// Memuat variabel lingkungan dari file .env
dotenv.config();

// Mengambil API key dan informasi lainnya dari .env
const apiKey = process.env.VITE_OPENROUTER_API_KEY;
const siteUrl = process.env.YOUR_SITE_URL;
const siteName = process.env.YOUR_SITE_NAME;

// Memeriksa apakah API key tersedia
if (!apiKey) {
  console.error('OPENROUTER_API_KEY tidak ditemukan di file .env');
  process.exit(1);
}

// Inisialisasi OpenAI client
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: apiKey,
  defaultHeaders: {
    "HTTP-Referer": siteUrl || "http://localhost", // Default ke localhost jika tidak ada
    "X-Title": siteName || "My App", // Default ke "My App" jika tidak ada
  },
});

async function main() {
  try {
    // Membuat request dengan streaming
    const stream = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          "role": "user",
          "content": "What is the meaning of life?"
        }
      ],
      stream: true, // Mengaktifkan streaming
    });

    // Menangani respons stream
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      process.stdout.write(content); // Menampilkan output secara bertahap
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();