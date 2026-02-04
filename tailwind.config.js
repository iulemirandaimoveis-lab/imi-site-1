/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    600: '#1E40AF',
                    700: '#1E3A8A',
                    800: '#1E3A70',
                    900: '#1A2744',
                },
                gold: {
                    500: '#D4AF37',
                    600: '#B8972D',
                },
                offwhite: '#FAFAFA',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                display: ['Playfair Display', 'serif'],
            },
            boxShadow: {
                soft: '0 4px 30px rgba(0, 0, 0, 0.05)',
                'soft-lg': '0 8px 40px rgba(0, 0, 0, 0.08)',
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
}
