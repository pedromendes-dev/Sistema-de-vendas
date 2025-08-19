module.exports = {
  /**
   * Configuração do ESLint
   * Sistema de Vendas - Pedro Mendes
   * 
   * Este arquivo configura as regras de linting
   * para manter a qualidade e consistência do código.
   */

  // Configuração do ambiente
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true,
    vitest: true,
  },

  // Extensões base
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],

  // Parser para TypeScript
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },

  // Plugins
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
    'prettier',
    'sonarjs',
    'unicorn',
  ],

  // Configurações específicas dos plugins
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },

  // Regras personalizadas
  rules: {
    // ========================================
    // REGRAS GERAIS
    // ========================================

    // Prettier
    'prettier/prettier': 'error',

    // Imports
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-unresolved': 'error',
    'import/no-unused-modules': 'error',
    'import/no-duplicates': 'error',

    // ========================================
    // REGRAS DO TYPESCRIPT
    // ========================================

    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: false,
      },
    ],

    // ========================================
    // REGRAS DO REACT
    // ========================================

    'react/react-in-jsx-scope': 'off', // Não necessário no React 17+
    'react/prop-types': 'off', // Usando TypeScript
    'react/display-name': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-uses-vars': 'error',
    'react/jsx-no-target-blank': 'error',
    'react/jsx-key': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-pascal-case': 'error',
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: true,
        shorthandFirst: true,
        ignoreCase: true,
        reservedFirst: true,
      },
    ],

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // ========================================
    // REGRAS DE ACESSIBILIDADE
    // ========================================

    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',

    // ========================================
    // REGRAS DO SONARJS
    // ========================================

    'sonarjs/cognitive-complexity': ['error', 15],
    'sonarjs/no-duplicate-string': 'error',
    'sonarjs/no-redundant-boolean': 'error',
    'sonarjs/prefer-immediate-return': 'error',
    'sonarjs/no-identical-functions': 'error',
    'sonarjs/no-inverted-boolean-check': 'error',
    'sonarjs/no-one-iteration-loop': 'error',
    'sonarjs/no-use-of-empty-return-value': 'error',
    'sonarjs/prefer-while': 'error',

    // ========================================
    // REGRAS DO UNICORN
    // ========================================

    'unicorn/better-regex': 'error',
    'unicorn/catch-error-name': 'error',
    'unicorn/consistent-destructuring': 'error',
    'unicorn/consistent-function-scoping': 'error',
    'unicorn/custom-error-definition': 'error',
    'unicorn/error-message': 'error',
    'unicorn/escape-case': 'error',
    'unicorn/expiring-todo-comments': 'error',
    'unicorn/explicit-length-check': 'error',
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          kebabCase: true,
          pascalCase: true,
        },
      },
    ],
    'unicorn/new-for-builtins': 'error',
    'unicorn/no-array-instanceof': 'error',
    'unicorn/no-console-spaces': 'error',
    'unicorn/no-for-loop': 'error',
    'unicorn/no-hex-escape': 'error',
    'unicorn/no-new-buffer': 'error',
    'unicorn/no-process-exit': 'error',
    'unicorn/no-unreadable-array-destructuring': 'error',
    'unicorn/no-unsafe-regex': 'error',
    'unicorn/no-unused-properties': 'error',
    'unicorn/no-useless-undefined': 'error',
    'unicorn/number-literal-case': 'error',
    'unicorn/prefer-add-event-listener': 'error',
    'unicorn/prefer-array-find': 'error',
    'unicorn/prefer-dataset': 'error',
    'unicorn/prefer-event-key': 'error',
    'unicorn/prefer-flat-map': 'error',
    'unicorn/prefer-includes': 'error',
    'unicorn/prefer-math-trunc': 'error',
    'unicorn/prefer-modern-dom-apis': 'error',
    'unicorn/prefer-negative-index': 'error',
    'unicorn/prefer-number-properties': 'error',
    'unicorn/prefer-optional-catch-binding': 'error',
    'unicorn/prefer-prototype-methods': 'error',
    'unicorn/prefer-query-selector': 'error',
    'unicorn/prefer-reflect-apply': 'error',
    'unicorn/prefer-regexp-test': 'error',
    'unicorn/prefer-set-has': 'error',
    'unicorn/prefer-spread': 'error',
    'unicorn/prefer-string-replace-all': 'error',
    'unicorn/prefer-string-slice': 'error',
    'unicorn/prefer-string-starts-ends-with': 'error',
    'unicorn/prefer-string-trim-start-end': 'error',
    'unicorn/prefer-ternary': 'error',
    'unicorn/prefer-type-error': 'error',
    'unicorn/throw-new-error': 'error',

    // ========================================
    // REGRAS PERSONALIZADAS
    // ========================================

    // Nomenclatura
    'camelcase': [
      'error',
      {
        properties: 'never',
        ignoreDestructuring: true,
        ignoreImports: true,
      },
    ],

    // Complexidade
    'complexity': ['error', 10],
    'max-depth': ['error', 4],
    'max-lines': ['error', 300],
    'max-lines-per-function': ['error', 50],
    'max-nested-callbacks': ['error', 3],
    'max-params': ['error', 4],

    // Formatação
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],

    // Variáveis
    'no-var': 'error',
    'prefer-const': 'error',
    'no-const-assign': 'error',
    'no-unused-vars': 'off', // Desabilitado em favor do TypeScript

    // Funções
    'func-style': ['error', 'expression'],
    'prefer-arrow-callback': 'error',
    'arrow-spacing': 'error',
    'no-confusing-arrow': 'error',

    // Objetos
    'object-shorthand': 'error',
    'prefer-object-spread': 'error',

    // Arrays
    'array-callback-return': 'error',
    'prefer-destructuring': [
      'error',
      {
        array: true,
        object: true,
      },
      {
        enforceForRenamedProperties: false,
      },
    ],

    // Strings
    'prefer-template': 'error',
    'template-curly-spacing': 'error',

    // Condicionais
    'no-else-return': 'error',
    'no-nested-ternary': 'error',
    'prefer-early-return': 'error',

    // Loops
    'no-array-constructor': 'error',
    'prefer-for-of': 'error',

    // Tratamento de erros
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error',

    // Performance
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',

    // Segurança
    'no-unsafe-finally': 'error',
    'no-unsafe-negation': 'error',
  },

  // Configurações específicas para arquivos
  overrides: [
    {
      // Arquivos de configuração
      files: ['*.config.js', '*.config.ts', 'vite.config.ts', 'tailwind.config.ts'],
      rules: {
        'import/no-commonjs': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      // Arquivos de teste
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'sonarjs/no-duplicate-string': 'off',
        'unicorn/no-useless-undefined': 'off',
      },
    },
    {
      // Arquivos de migração
      files: ['database/migrations/**/*.sql'],
      rules: {
        'prettier/prettier': 'off',
      },
    },
  ],

  // Configurações de ignorar
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '*.min.js',
    '*.bundle.js',
    'public/',
    'assets/',
    'backups/',
    'logs/',
  ],
};
