/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}','./components/**/*.{js,jsx}','./app/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'primary':'#005894','primary-container':'#0071bc','on-primary':'#ffffff',
        'on-primary-container':'#eaf1ff','primary-fixed':'#d1e4ff','primary-fixed-dim':'#9ecaff',
        'secondary':'#46607e','secondary-container':'#c2dcff','on-secondary-container':'#47617f',
        'tertiary':'#804700','tertiary-container':'#a35c00','on-tertiary':'#ffffff','on-tertiary-container':'#ffeee2',
        'surface':'#f8f9fa','surface-bright':'#f8f9fa','surface-dim':'#d9dadb',
        'surface-container-lowest':'#ffffff','surface-container-low':'#f3f4f5',
        'surface-container':'#edeeef','surface-container-high':'#e7e8e9','surface-container-highest':'#e1e3e4',
        'on-surface':'#191c1d','on-surface-variant':'#404751',
        'outline':'#717882','outline-variant':'#c0c7d3',
        'error':'#ba1a1a','error-container':'#ffdad6','on-error-container':'#93000a',
      },
      fontFamily: { headline:['Manrope','sans-serif'], body:['Inter','sans-serif'], label:['Inter','sans-serif'] },
      borderRadius: { DEFAULT:'0.25rem', lg:'0.5rem', xl:'0.75rem', '2xl':'1rem', full:'9999px' },
    },
  },
  plugins: [],
}
