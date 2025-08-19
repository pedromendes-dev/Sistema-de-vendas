import type { Config } from 'tailwindcss';

/**
 * Configuração do Tailwind CSS
 * Sistema de Vendas - Pedro Mendes
 * 
 * Este arquivo configura o Tailwind CSS com
 * cores personalizadas e componentes customizados.
 */

const config: Config = {
  content: [
    './client/src/**/*.{js,ts,jsx,tsx}',
    './client/public/index.html',
    './shared/**/*.{js,ts,jsx,tsx}',
  ],
  
  theme: {
    extend: {
      // ========================================
      // CORES PERSONALIZADAS
      // ========================================
      
      colors: {
        // Cores principais do sistema
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        
        // Cores de sucesso
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        
        // Cores de aviso
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        
        // Cores de erro
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        
        // Cores de informação
        info: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        
        // Cores neutras personalizadas
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        
        // Cores de gamificação
        gamification: {
          gold: '#ffd700',
          silver: '#c0c0c0',
          bronze: '#cd7f32',
          points: '#ff6b6b',
          level: '#4ecdc4',
          achievement: '#45b7d1',
        },
        
        // Cores de vendas
        sales: {
          revenue: '#10b981',
          profit: '#059669',
          commission: '#f59e0b',
          target: '#3b82f6',
          performance: '#8b5cf6',
        },
      },
      
      // ========================================
      // TIPOGRAFIA
      // ========================================
      
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      
      // ========================================
      // ESPAÇAMENTO
      // ========================================
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      
      // ========================================
      // BORDAS E SOMBRAS
      // ========================================
      
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-success': '0 0 20px rgba(34, 197, 94, 0.5)',
        'glow-warning': '0 0 20px rgba(245, 158, 11, 0.5)',
        'glow-error': '0 0 20px rgba(239, 68, 68, 0.5)',
      },
      
      // ========================================
      // ANIMAÇÕES
      // ========================================
      
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-in',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-in',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-gentle': 'pulseGentle 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.9)', opacity: '0' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      
      // ========================================
      // TRANSFORMAÇÕES
      // ========================================
      
      transformOrigin: {
        'center': 'center',
        'top': 'top',
        'top-right': 'top right',
        'right': 'right',
        'bottom-right': 'bottom right',
        'bottom': 'bottom',
        'bottom-left': 'bottom left',
        'left': 'left',
        'top-left': 'top left',
      },
      
      // ========================================
      // GRADIENTES
      // ========================================
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-success': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-warning': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-error': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'gradient-info': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      },
      
      // ========================================
      // BACKDROP FILTERS
      // ========================================
      
      backdropBlur: {
        'xs': '2px',
      },
      
      // ========================================
      // SCROLL BEHAVIOR
      // ========================================
      
      scrollBehavior: {
        'smooth': 'smooth',
        'auto': 'auto',
      },
    },
  },
  
  // ========================================
  // PLUGINS
  // ========================================
  
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
    
    // Plugin personalizado para componentes
    function({ addComponents, theme }) {
      addComponents({
        // Botão primário
        '.btn-primary': {
          backgroundColor: theme('colors.primary.600'),
          color: theme('colors.white'),
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
          borderRadius: theme('borderRadius.lg'),
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: theme('colors.primary.700'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.medium'),
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        
        // Card com sombra suave
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.xl'),
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.soft'),
          border: `1px solid ${theme('colors.gray.100')}`,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: theme('boxShadow.medium'),
            transform: 'translateY(-2px)',
          },
        },
        
        // Input estilizado
        '.input': {
          width: '100%',
          padding: `${theme('spacing.3')} ${theme('spacing.4')}`,
          border: `2px solid ${theme('colors.gray.200')}`,
          borderRadius: theme('borderRadius.lg'),
          fontSize: theme('fontSize.base'),
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.primary.500'),
            boxShadow: `0 0 0 3px ${theme('colors.primary.100')}`,
          },
          '&:hover': {
            borderColor: theme('colors.gray.300'),
          },
        },
        
        // Badge com cores dinâmicas
        '.badge': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
          borderRadius: theme('borderRadius.full'),
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
          lineHeight: theme('lineHeight.tight'),
        },
        
        // Badge de sucesso
        '.badge-success': {
          backgroundColor: theme('colors.success.100'),
          color: theme('colors.success.800'),
        },
        
        // Badge de aviso
        '.badge-warning': {
          backgroundColor: theme('colors.warning.100'),
          color: theme('colors.warning.800'),
        },
        
        // Badge de erro
        '.badge-error': {
          backgroundColor: theme('colors.error.100'),
          color: theme('colors.error.800'),
        },
        
        // Badge de informação
        '.badge-info': {
          backgroundColor: theme('colors.info.100'),
          color: theme('colors.info.800'),
        },
      });
    },
  ],
  
  // ========================================
  // CONFIGURAÇÕES DE VARIANTES
  // ========================================
  
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      backgroundColor: ['active', 'disabled'],
      borderColor: ['active', 'disabled'],
      textColor: ['active', 'disabled'],
      scale: ['active', 'group-hover'],
      rotate: ['active', 'group-hover'],
      translate: ['active', 'group-hover'],
    },
  },
  
  // ========================================
  // CONFIGURAÇÕES DE PREFIX
  // ========================================
  
  prefix: '',
  
  // ========================================
  // CONFIGURAÇÕES DE IMPORTANT
  // ========================================
  
  important: false,
  
  // ========================================
  // CONFIGURAÇÕES DE SEPARATOR
  // ========================================
  
  separator: ':',
  
  // ========================================
  // CONFIGURAÇÕES DE CORE PLUGINS
  // ========================================
  
  corePlugins: {
    preflight: true,
    container: true,
    accessibility: true,
  },
};

export default config;
