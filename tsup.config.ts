import { defineConfig } from 'tsup';
import pckg from './package.json';

export default defineConfig({
	entry: ['src/app.ts'],
	outDir: 'dist',
	dts: true,
	format: ['cjs'],
	clean: true,
	tsconfig: './tsconfig.json',
	minify: true,
	minifyIdentifiers: true,
	minifySyntax: true,
	minifyWhitespace: true,
	banner: {
		js: `/**
* Created by Antonio Carlo "Anton" Autor 2025
* Package: ${pckg.name}
* Description: ${pckg.description}
* Version: ${pckg.version}
* Build Date: ${new Date().toISOString()}
*/`,
	},
});
