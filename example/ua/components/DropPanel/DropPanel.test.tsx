import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DropPanel } from './DropPanel'

describe('DropPanel', () => {
	it('renders the panel correctly and responds to click events to open and close', async () => {
		render(<DropPanel buttonLabel="Click Me">Panel Content</DropPanel>)
		const contentPanel = screen.getByTestId('accordion-detail')
		const menuButton = screen.getByRole('button')
		expect(menuButton).toHaveTextContent('Click Me')
		expect(contentPanel).toHaveAttribute('aria-expanded', String(false))

		await userEvent.click(menuButton)
		expect(contentPanel).toHaveAttribute('aria-expanded', String(true))
	})
	it('fires off callback events when the panel is opened and closed', async () => {
		const onOpenFn = jest.fn()
		const onCloseFn = jest.fn()
		render(
			<DropPanel buttonLabel="Click Me" onOpen={onOpenFn} onClose={onCloseFn}>
				Panel Content
			</DropPanel>,
		)

		const menuButton = screen.getByRole('button')
		await userEvent.click(menuButton)
		expect(onOpenFn).toHaveBeenCalled()

		await userEvent.click(menuButton)
		expect(onCloseFn).toHaveBeenCalled()
	})
})
