import type { Config } from 'tailwindcss'

const config: Config = {
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
                },
                gold: {
                    500: '#D4AF37',
                    600: '#B8972D',
                },
                offwhite: '#FAFAFA',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Playfair Display', 'serif'],
            },
            boxShadow: {
                soft: '0 4px 30px rgba(0, 0, 0, 0.05)',
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography')
    ],
}
export default config
