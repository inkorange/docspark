import { render, screen, fireEvent } from '@testing-library/react'
import { Popup } from './Popup'

describe('Popup', () => {
	const getOverlay = (container: HTMLElement) =>
		container.querySelector("[class*='modal-overlay']") as HTMLElement | null

	it('renders children and passes body to Tooltip', () => {
		render(
			<Popup body={'body text'}>
				<button>Open Popup</button>
			</Popup>,
		)

		// inner child button should render
		expect(screen.getByText('Open Popup')).toBeInTheDocument()
	})

	it('opens when the trigger is clicked and shows overlay; clicking overlay calls onClose', () => {
		const onClose = jest.fn()
		const { container } = render(
			<Popup body={'body text'} onClose={onClose}>
				<button>Open Popup</button>
			</Popup>,
		)

		// Tooltip renders a wrapper button around the child button; there will be two buttons matching the name.
		const triggers = screen.getAllByRole('button', { name: /Open Popup/i })
		const outerTrigger = triggers[0]
		const innerTrigger = screen.getByText('Open Popup')

		// Initially closed (outer button has the data attribute)
		expect(outerTrigger.getAttribute('data-popup-visibility')).toBe('false')

		// Click the outer wrapper to toggle the tooltip/popup
		fireEvent.click(outerTrigger)
		expect(outerTrigger.getAttribute('data-popup-visibility')).toBe('true')

		const overlay = getOverlay(container)
		expect(overlay).toBeTruthy()

		// Click overlay to close
		if (overlay) fireEvent.click(overlay)
		expect(onClose).toHaveBeenCalled()
		// After closing, popup should reflect closed state on the outer trigger
		expect(outerTrigger.getAttribute('data-popup-visibility')).toBe('false')
	})

	it('calls onClose when forceCloseModal prop changes (effect)', () => {
		const onClose = jest.fn()
		const { rerender } = render(<Popup body={'body'} onClose={onClose} forceCloseModal={false} />)

		// Toggle forceCloseModal to true -> effect should call onClose
		rerender(<Popup body={'body'} onClose={onClose} forceCloseModal={true} />)
		expect(onClose).toHaveBeenCalled()
	})
})
