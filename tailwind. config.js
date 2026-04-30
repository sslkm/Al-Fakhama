/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // الأسود العميق (درجات للخلفيات والنصوص)
        'jet': {
          DEFAULT: '#0A0A0A',   // أعمق أسود (خلفية رئيسية)
          '900': '#111111',
          '800': '#1A1A1A',
          '700': '#222222',
          '600': '#2A2A2A',
        },
        // الذهبي الفخم
        'gold': {
          50: '#FFF9E6',
          100: '#FFF1CC',
          200: '#FFE499',
          300: '#FFD666',
          400: '#FFC933',
          500: '#D4AF37',   // الذهبي الأساسي (ذهبي معدني)
          600: '#B8960F',
          700: '#8A700B',
          800: '#5C4A07',
          900: '#2E2403',
          950: '#1A1401',
        },
        // لون ذهبي فاتح للتأثيرات (glow)
        'gold-light': '#F6E27A',
        'gold-dark': '#C5A55A',
      },
      fontFamily: {
        // خطوط فخمة: عناوين بخط serif، والمحتوى بخط sans راقي
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        // تدرج فاخر للخلفيات
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F6E27A 50%, #C5A55A 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)',
      },
      boxShadow: {
        'gold': '0 0 15px rgba(212, 175, 55, 0.3)',
        'gold-lg': '0 0 30px rgba(212, 175, 55, 0.5)',
        'inner-gold': 'inset 0 0 10px rgba(212, 175, 55, 0.2)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}