import { fileURLToPath, URL } from 'url';
import { defineConfig, splitVendorChunkPlugin, type PluginOption } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import eslint from 'vite-plugin-eslint';
import globals from './globals';
import dns from 'dns';
import { PORT, IMAGE_EXTENSIONS } from './vite.constants';
import react from '@vitejs/plugin-react';

interface AliasInterface {
	find: string;
	replacement: string;
}

dns.setDefaultResultOrder('verbatim');

export default defineConfig({
	build: {
		rollupOptions: {
			output: {
				entryFileNames: '[name].bundle.[hash].js',
				chunkFileNames: '[name].chunk.bundle.[hash].js',
				assetFileNames: assetInfo => {
					if (assetInfo.name?.endsWith('.css')) {
						// Output CSS files directly to the root 'dist' folder,
						// otherwise the CSS files will be placed in the images folder
						return '[name].[hash].css';
					} else if (
						IMAGE_EXTENSIONS.some(
							ext => assetInfo.name?.endsWith(ext),
						)
					) {
						// Output image files to the 'images' folder
						return `images/[name].[ext]`;
					} else {
						// For other assets (fonts, etc.), keep the original folder structure
						return `[name].[ext]`;
					}
				},
				dir: 'dist',
			},
		},

		sourcemap: process.env.NODE_ENV !== 'production',
		minify: process.env.NODE_ENV === 'production',
	},
	server: {
		port: PORT,
		open: true,
	},
	resolve: {
		alias: defineAliases(),
	},
	define: {
		...globals,
	},
	plugins: [
		react(),
		nodePolyfills({
			protocolImports: true,
		}),
		eslint({
			include: ['src/**/*.ts', 'src/**/*.tsx'],
			exclude: ['node_modules/**', 'dist/**'],
		}),
	],
});

function defineAliases() {
	const alias: AliasInterface[] = [];

	alias.push({
		find: '@src',
		replacement: fileURLToPath(new URL('./src', import.meta.url)),
	});

	return alias;
}
