import { defineConfig } from 'tsup';

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
		js: '/** (c) 2025 Antonio Carlo Autor */',
	},
});
