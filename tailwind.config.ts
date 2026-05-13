import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        // macOS 风格字体栈
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"SF Mono"',
          '"Monaco"',
          '"Inconsolata"',
          '"Fira Code"',
          '"Courier New"',
          'monospace',
        ],
      },
      colors: {
        // 深蓝紫色主题（AI/论文风格）
        brand: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d8ff',
          300: '#a3beff',
          400: '#7b9dff',
          500: '#5b7cff',
          600: '#4a62f5',
          700: '#3d4cc2',
          800: '#2d3a8f',
          900: '#1f2657',
        },
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            // 基础排版
            '--tw-prose-body': 'rgb(67 56 202)',
            '--tw-prose-headings': 'rgb(15 23 42)',
            '--tw-prose-lead': 'rgb(55 65 81)',
            '--tw-prose-links': 'rgb(37 99 235)',
            '--tw-prose-bold': 'rgb(15 23 42)',
            '--tw-prose-counters': 'rgb(107 114 128)',
            '--tw-prose-bullets': 'rgb(209 213 219)',
            '--tw-prose-hr': 'rgb(229 231 235)',
            '--tw-prose-quotes': 'rgb(55 65 81)',
            '--tw-prose-quote-borders': 'rgb(229 231 235)',
            '--tw-prose-captions': 'rgb(107 114 128)',
            '--tw-prose-code': 'rgb(139 92 246)',
            '--tw-prose-pre-bg': 'rgb(15 23 42)',
            '--tw-prose-pre-code': 'rgb(229 231 235)',
            '--tw-prose-th-borders': 'rgb(209 213 219)',
            '--tw-prose-td-borders': 'rgb(229 231 235)',
            '--tw-prose-invert-body': 'rgb(226 232 240)',
            '--tw-prose-invert-headings': 'rgb(241 245 250)',
            '--tw-prose-invert-lead': 'rgb(148 163 184)',
            '--tw-prose-invert-links': 'rgb(96 165 250)',
            '--tw-prose-invert-bold': 'rgb(241 245 250)',
            '--tw-prose-invert-counters': 'rgb(148 163 184)',
            '--tw-prose-invert-bullets': 'rgb(51 65 85)',
            '--tw-prose-invert-hr': 'rgb(51 65 85)',
            '--tw-prose-invert-quotes': 'rgb(148 163 184)',
            '--tw-prose-invert-quote-borders': 'rgb(51 65 85)',
            '--tw-prose-invert-captions': 'rgb(148 163 184)',
            '--tw-prose-invert-code': 'rgb(165 243 252)',
            '--tw-prose-invert-pre-bg': 'rgba(15, 23, 42, 0.5)',
            '--tw-prose-invert-pre-code': 'rgb(226 232 240)',
            '--tw-prose-invert-th-borders': 'rgb(51 65 85)',
            '--tw-prose-invert-td-borders': 'rgb(51 65 85)',
            // 文字大小和行高
            fontSize: '1rem',
            lineHeight: '1.75',
            // 标题
            'h1,h2,h3,h4,h5,h6': {
              fontWeight: '600',
              letterSpacing: '-0.02em',
            },
            h1: {
              fontSize: '2.25rem',
              lineHeight: '2.5rem',
              marginTop: '0',
              marginBottom: '1.33333em',
            },
            h2: {
              fontSize: '1.875rem',
              lineHeight: '2.25rem',
              marginTop: '2em',
              marginBottom: '1em',
            },
            h3: {
              fontSize: '1.5rem',
              lineHeight: '2rem',
              marginTop: '1.6em',
              marginBottom: '0.6em',
            },
            // 代码块
            pre: {
              backgroundColor: 'rgb(15 23 42 / 0.95)',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              overflowX: 'auto',
            },
            code: {
              padding: '0',
              fontSize: '0.875em',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            // 块引用
            blockquote: {
              borderLeftWidth: '4px',
              borderLeftColor: 'rgb(59 130 246)',
              paddingLeft: '1.25rem',
              fontStyle: 'normal',
              fontWeight: '500',
              color: 'rgb(55 65 81)',
            },
            // 表格
            table: {
              fontSize: '0.875em',
              lineHeight: '1.5',
            },
            thead: {
              borderBottomWidth: '2px',
              borderBottomColor: 'rgb(209 213 219)',
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: 'rgb(229 231 235)',
            },
            // 列表
            'ul > li': {
              paddingLeft: '1.5em',
            },
            'ol > li': {
              paddingLeft: '1.5em',
            },
            // 图片
            img: {
              borderRadius: '0.5rem',
            },
            // 链接
            a: {
              color: 'rgb(37 99 235)',
              textDecoration: 'underline',
              fontWeight: '500',
              transitionProperty: 'color',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDuration: '150ms',
            },
            'a:hover': {
              color: 'rgb(29 78 216)',
            },
            // 宽度控制 - 防止行过长
            'max-width': '70ch',
          },
        },
      }),
      boxShadow: {
        soft: '0 12px 40px rgba(15, 23, 42, 0.08)',
        md: '0 4px 12px rgba(15, 23, 42, 0.1)',
        lg: '0 8px 24px rgba(15, 23, 42, 0.12)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
