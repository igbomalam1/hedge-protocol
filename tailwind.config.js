/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                forest: {
                    DEFAULT: '#2D5A27',
                    dark: '#1B3A1A',
                    light: '#4A7C44',
                },
                earth: {
                    DEFAULT: '#5D4037',
                    dark: '#3E2723',
                    light: '#8D6E63',
                },
                amber: {
                    DEFAULT: '#FFBF00',
                    dark: '#D49B00',
                    light: '#FFD54F',
                },
            },
            fontFamily: {
                inter: ["var(--font-inter)"],
                playfair: ["var(--font-playfair)"],
            },
        },
    },
    plugins: [],
};
