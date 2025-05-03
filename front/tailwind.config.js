/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            textColor: {
                "h-dark": "#e9ecef",
                "p-dark": "#dadada",
                "s-dark": "#b0b0b0",
                "hover": "#feaf51",
                "c-blue": "#3c476a",
                "c-orange": "#fe8764"
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            boxShadow: {
                "custom-dark": "0px 1px 4px #000000",
                "shadow-header": "0px 3px 2px #b4b4b4"
            },
            boxShadowColor: {
                "low-dark": "#171717",
                "full-dark": "#000000"
            },
            borderColor: {
                "bg-dark": "#6b7280",
            },
            colors: {
                "blue-low": "#1f2866",
                "blue-full": "#07285e",
                "orange-low": "#e7af9c",
                "orange-full": "#dd6415"
            },
            backgroundColor: {
                "light-theme": "#ffffff",
                "blue-color": "#07285e",
                "orange-color": "#ff631c",
                "hight-dark": "#1d1d1d",
                "input-dark": "#48484b69",
                "custom-dark": "#212121",
                "info-dark": "#232528"
            },
        },
    },
    plugins: [],
};
