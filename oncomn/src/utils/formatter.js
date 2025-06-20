// oncomn/src/utils/formatter.js

import prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import parserHtml from "prettier/plugins/html";
import parserPostCss from "prettier/plugins/postcss";

/**
 * Merapikan string kode menggunakan Prettier secara otomatis.
 * @param {string} code - Kode yang belum diformat.
 * @param {'html' | 'css' | 'js'} language - Bahasa kode.
 * @returns {Promise<string>} - Kode yang sudah diformat.
 */
export const formatCode = async (code, language) => {
  let parser;
  let plugins;

  switch (language) {
    case 'html':
      parser = 'html';
      plugins = [parserHtml];
      break;
    case 'css':
      parser = 'css';
      plugins = [parserPostCss];
      break;
    case 'js':
      parser = 'babel';
      plugins = [parserBabel];
      break;
    default:
      // Jika bahasa tidak didukung, kembalikan kode asli
      return code;
  }

  try {
    const formattedCode = await prettier.format(code, {
      parser: parser,
      plugins: plugins,
      tabWidth: 2,
      semi: true,
      singleQuote: true, // Opsi tambahan untuk konsistensi
    });
    return formattedCode;
  } catch (error) {
    console.error(`Could not format ${language} code:`, error);
    // Jika terjadi error (misal, syntax tidak valid), kembalikan kode asli
    return code;
  }
};