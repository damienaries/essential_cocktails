import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataLoadError } from '../../src/components/DataLoadError'

const firebaseError = new Error('Missing or insufficient permissions.')

describe('DataLoadError', () => {
	it('shows plain copy naming what failed', () => {
		render(<DataLoadError subject="the drinks" error={firebaseError} />)

		expect(screen.getByRole('alert')).toHaveTextContent(
			/We couldn’t load the drinks just now/,
		)
	})

	it('keeps the raw error out of the user-facing copy', () => {
		render(<DataLoadError subject="the drinks" error={firebaseError} />)

		// In dev the detail lives inside a collapsed <details>, never in the message
		// itself. The assertion that matters: it is not part of the headline copy.
		const alert = screen.getByRole('alert')
		const headline = alert.querySelector('p')
		expect(headline?.textContent).not.toContain('insufficient permissions')
	})

	it('offers a retry when one is available', async () => {
		const onRetry = vi.fn()
		const user = userEvent.setup()
		render(
			<DataLoadError
				subject="the drinks"
				error={firebaseError}
				onRetry={onRetry}
			/>,
		)

		await user.click(screen.getByRole('button', { name: 'Try again' }))
		expect(onRetry).toHaveBeenCalledTimes(1)
	})

	it('omits the retry button when there is nothing to retry', () => {
		render(<DataLoadError subject="the glossary" error={firebaseError} />)

		expect(screen.queryByRole('button')).not.toBeInTheDocument()
	})

	it('survives a non-Error rejection value', () => {
		render(<DataLoadError subject="the drinks" error="just a string" />)

		expect(screen.getByRole('alert')).toBeInTheDocument()
	})
})
