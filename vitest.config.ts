import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: [
			'tests/lib/**/*.test.{ts,tsx}',
			'tests/components/**/*.test.{ts,tsx}',
		],
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./tests/setup.ts'],
	},
})
