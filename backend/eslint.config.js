export default [
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                // Equivalente a env: { node: true }
                'process': 'readonly',
                '__dirname': 'readonly',
                '__filename': 'readonly',
                'module': 'readonly',
                'exports': 'readonly',
                'require': 'readonly',
                'console': 'readonly',
            }
        },
        rules: {
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'no-unused-vars': 'warn'
        },
        // Esto es equivalente a establecer env.node: true
        files: ['**/*.js']
    }
];
