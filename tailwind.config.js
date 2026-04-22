/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}','./components/**/*.{js,jsx}','./app/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'primary':'#4E49F2','primary-container':'#5D57FF','on-primary':'#ffffff',
        'on-primary-container':'#eaf1ff','primary-fixed':'#d1e4ff','primary-fixed-dim':'#9ecaff',
        'secondary':'#64748B','secondary-container':'#c2dcff','on-secondary-container':'#47617f',
        'tertiary':'#804700','tertiary-container':'#a35c00','on-tertiary':'#ffffff','on-tertiary-container':'#ffeee2',
        'surface':'#F8FAFC','surface-bright':'#F8FAFC','surface-dim':'#E2E8F0',
        'surface-container-lowest':'#ffffff','surface-container-low':'#F1F5F9',
        'surface-container':'#E2E8F0','surface-container-high':'#CBD5E1','surface-container-highest':'#94A3B8',
        'on-surface':'#0F172A','on-surface-variant':'#64748B',
        'outline':'#94A3B8','outline-variant':'#CBD5E1',
        'error':'#ba1a1a','error-container':'#ffdad6','on-error-container':'#93000a',
      },
      fontFamily: { headline:['Manrope','sans-serif'], body:['Inter','sans-serif'], label:['Inter','sans-serif'] },
      borderRadius: { DEFAULT:'0.25rem', lg:'0.5rem', xl:'0.75rem', '2xl':'1rem', full:'9999px' },
    },
  },
  plugins: [],
}
