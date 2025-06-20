// onsite/oncomn/src/utils/formatter.js

import prettier from 'prettier/standalone';
// Impor parser yang dibutuhkan secara eksplisit
import parserBabel from 'prettier/plugins/babel';
import parserHtml from 'prettier/plugins/html';
import parserPostCss from 'prettier/plugins/postcss';

const languageParsers = {
  html: { parser: 'html', plugins: [parserHtml] },
  css: { parser: 'css', plugins: [parserPostCss] },
  // Daftarkan parser babel untuk javascript
  js: { parser: 'babel', plugins: [parserBabel] },
};

/**
 * Formats code using Prettier.
 * @param {string} code The code to format.
 * @param {('html'|'css'|'js')} language The programming language.
 * @returns {Promise<string>} The formatted code.
 */
export const formatCode = async (code, language) => {
  if (!code || !languageParsers[language]) {
    return code;
  }

  try {
    const { parser, plugins } = languageParsers[language];
    const formattedCode = await prettier.format(code, {
      parser: parser,
      plugins: plugins, // Gunakan plugins yang sudah diimpor
      // Opsi Prettier lainnya bisa ditambahkan di sini
      semi: true,
      singleQuote: true,
      tabWidth: 2,
    });
    return formattedCode;
  } catch (error) {
    // Log error ini agar lebih mudah di-debug, tapi jangan sampai crash aplikasi
    console.error(`Could not format ${language} code:`, error);
    // Kembalikan kode asli jika terjadi error pemformatan
    return code;
  }
};