/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#F6F8F7',
        primary: '#000000',
        active: '#00E576',
        inactive: '#434343',
        accent: {
          green: '#16a34a ',
          red: '#E50004',
        }
      },
      fontFamily: {
        "poppins-light": ["Poppins-Light"],
        "poppins-regular": ["Poppins-Regular"],
        "poppins-medium": ["Poppins-Medium"],
        "poppins-semibold": ["Poppins-SemiBold"],
        "poppins-bold": ["Poppins-Bold"],
      },
    },
  },
  plugins: [],
}

