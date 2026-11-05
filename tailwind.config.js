/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D60FF',
          hover: '#1B4DE8',
          light: '#EBF1FF',
        },
        dark: {
          heading: '#343C6A',
          body: '#718EBF',
          muted: '#8BA3CB',
        },
        surface: {
          bg: '#F5F7FA',
          card: '#FFFFFF',
          border: '#E6EFF5',
        },
        credit: {
          DEFAULT: '#16DBAA',
          light: '#DCFAF8',
          dark: '#0EA882',
        },
        debit: {
          DEFAULT: '#FE5C73',
          light: '#FFE0EB',
          dark: '#E0334C',
        },
        warning: {
          DEFAULT: '#FFBB38',
          light: '#FFF5D9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '25px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(0, 0, 0, 0.03)',
        cardHover: '0 8px 30px rgba(0, 0, 0, 0.07)',
      },
    },
  },
  plugins: [],
}
