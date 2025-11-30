module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'react-app',
    'react-app/jest',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
  ],
  rules: {
    // React specific rules
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/prop-types': 'warn',
    'react/jsx-uses-react': 'off',
    'react/jsx-uses-vars': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-unknown-property': 'error',
    'react/self-closing-comp': 'warn',
    
    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // General JavaScript rules
    'no-console': 'error',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-undef': 'error',
    'no-var': 'error',
    'prefer-const': 'warn',
    'prefer-arrow-callback': 'warn',
    'no-duplicate-imports': 'error',
    
    // Import rules
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'off', // Handled by webpack
    
    // Code style
    'semi': ['warn', 'always'],
    'quotes': ['warn', 'single', { avoidEscape: true }],
    'comma-dangle': ['warn', 'always-multiline'],
    'object-curly-spacing': ['warn', 'always'],
    'array-bracket-spacing': ['warn', 'never'],
    'indent': ['warn', 2, { SwitchCase: 1 }],
    
    // Accessibility
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
};
