/**
 * Configuração do PostCSS
 * Sistema de Vendas - Pedro Mendes
 * 
 * Este arquivo configura o PostCSS para processar
 * CSS com plugins como Tailwind e Autoprefixer.
 */

module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-media-queries': true,
        'media-query-ranges': true,
      },
    },
  },
};
