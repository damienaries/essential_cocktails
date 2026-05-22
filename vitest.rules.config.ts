import { defineConfig } from 'vitest/config'

/**
 * Separate config for security-rules tests because they need:
 *  - the Node environment (no jsdom)
 *  - the Firebase emulators running (see `npm run test:rules`)
 *  - a longer timeout for the SDK ↔ emulator round-trips
 *
 * The default `npm test` excludes these so it doesn't depend on the emulator.
 */
export default defineConfig({
	test: {
		include: ['tests/rules/**/*.test.ts'],
		environment: 'node',
		globals: true,
		setupFiles: ['./tests/rules/setup.ts'],
		testTimeout: 15000,
		hookTimeout: 30000,
	},
})
