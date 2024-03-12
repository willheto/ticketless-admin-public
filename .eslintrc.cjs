'use strict';

const path = require('path');

module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'react', 'react-hooks'],
	env: {
		browser: true,
		jest: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'plugin:react-hooks/recommended',
	],
	rules: {
		'@typescript-eslint/explicit-function-return-type': 'error',
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/ban-ts-comment': 'error',
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/no-var-requires': 'error',
		'@typescript-eslint/no-non-null-assertion': 'error',
		'react/no-direct-mutation-state': 'error',
		'react/no-deprecated': 'error',
		'react/no-string-refs': 'error',
		'react/require-render-return': 'error',
		'prefer-const': 'error',
		'no-misleading-character-class': 'error',
		'react/jsx-filename-extension': [
			'error',
			{
				extensions: ['.jsx', '.tsx'],
			},
		],
		'react/prop-types': 'off',
	},
	settings: {
		react: {
			version: 'detect',
		},
		linkComponents: ['Hyperlink', { name: 'Link', linkAttribute: 'to' }],
		defaultSeverity: 'error',
	},
	parserOptions: {
		project: path.resolve(__dirname, 'tsconfig.json'),
		tsconfigRootDir: __dirname,
		ecmaVersion: 2018,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	ignorePatterns: [
		'.eslintrc.cjs',
		'node_modules/',
		'globals.ts',
		'global.d.ts',
		'vite.config.ts',
		'vite.constants.ts',
		'postcss.config.js',
		'serviceWorker.js',
		'api/',
	],
};
