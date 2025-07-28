import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/app.ts'],
	outDir: 'dist',
	dts: true,
	format: ['cjs'],
	clean: true,
	sourcemap: true,
	tsconfig: './tsconfig.json',
});
