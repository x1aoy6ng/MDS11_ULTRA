/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#187FF5',
          dark: '#4E98ED'
        },
        background: {
          light: '#F7F9FF',
          dark: '#282828'
        },
        container: {
          light: '#F9F9F9',
          dark: '#46444B'
        },
        container_segment: {
          light: '#E5E5E5',
          dark: '#2F2E32'
        },
        text: {
          
        }
      }
    },
  },
  plugins: [],
}
