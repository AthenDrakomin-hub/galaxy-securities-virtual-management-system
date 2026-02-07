import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 工业风核心配色（深灰、铁锈红、卡其、哑光黑等）
      colors: {
        industrial: {
          dark: '#1A1A1A', // 哑光黑
          gray: '#4A4A4A', // 工业深灰
          rust: '#8B4513', // 铁锈红
          khaki: '#C4B492', // 卡其色
          steel: '#708090', // 钢铁灰
          concrete: '#D3D3D3', // 水泥灰
        },
      },
      // 工业风字体（硬朗的无衬线字体）
      fontFamily: {
        industrial: ['Inter', 'Roboto', 'sans-serif'],
      },
      // 工业风边框/阴影（粗旷、无圆角）
      borderRadius: {
        none: '0px', // 工业风常用直角
      },
      boxShadow: {
        'industrial': '2px 2px 0px 0px #1A1A1A', // 硬朗的阴影效果
      },
    },
  },
  plugins: [],
};

export default config;