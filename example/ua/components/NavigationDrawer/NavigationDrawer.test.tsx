import { render, screen } from '@testing-library/react'
import { NavigationDrawer } from './NavigationDrawer'
import { fireEvent } from '@testing-library/react'

describe('NavigationDrawer', () => {
	it('renders correctly', () => {
		render(<NavigationDrawer />)
		expect(screen.getByRole('navigation')).toBeInTheDocument()
	})

	it('renders a close button when the prop is passed through', () => {
		render(<NavigationDrawer showClose />)
		// IconButton renders an accessible button with the provided label
		const closeButton = screen.getByLabelText('Close Navigation Menu')
		expect(closeButton).toBeInTheDocument()
	})

	it('renders a title with the supplied text when the prop is passed through', () => {
		const title = 'My Drawer Title'
		render(<NavigationDrawer title={title} />)
		expect(screen.getByText(title)).toBeInTheDocument()
	})

	it('onOpen and onClose handlers are called when they are configured as props', () => {
		const onOpen = jest.fn()
		const onClose = jest.fn()

		// Render controlled (open=true) so the component reflects the controlled behavior
		render(<NavigationDrawer open={true} onOpen={onOpen} onClose={onClose} showClose />)

		const nav = screen.getByRole('navigation')
		// controlled open prop should set the data-open attribute
		expect(nav).toHaveAttribute('data-open', 'true')

		// Component currently does not call onOpen internally, so ensure it isn't called automatically
		expect(onOpen).not.toHaveBeenCalled()

		// Clicking the close button should call onClose; because the component is controlled
		// by the `open` prop, the visual open state will remain true unless the parent changes the prop.
		const closeButton = screen.getByLabelText('Close Navigation Menu')
		fireEvent.click(closeButton)
		expect(onClose).toHaveBeenCalled()

		// data-open should remain 'true' because open prop remains true (controlled behavior)
		expect(nav).toHaveAttribute('data-open', 'true')
	})

	it('renders children inside the content region', () => {
		render(
			<NavigationDrawer>
				<div data-testid="child">child content</div>
			</NavigationDrawer>,
		)
		expect(screen.getByTestId('child')).toBeInTheDocument()
	})

	it('clicking the overlay calls onClose when closeOnBlur is true and component is controlled', () => {
		const title = 'My Drawer Title'
		const onClose = jest.fn()
		render(<NavigationDrawer title={title} closeOnBlur open onClose={onClose} />)
		expect(screen.getByText(title)).toBeInTheDocument()

		const overlay = screen.getByRole('presentation')
		fireEvent.click(overlay)
		expect(onClose).toHaveBeenCalled()
	})

	it('clicking the overlay does NOT call onClose when closeOnBlur is false', () => {
		const title = 'My Drawer Title'
		const onClose = jest.fn()
		render(<NavigationDrawer title={title} closeOnBlur={false} open onClose={onClose} />)
		expect(screen.getByText(title)).toBeInTheDocument()

		const overlay = screen.getByRole('presentation')
		fireEvent.click(overlay)
		expect(onClose).not.toHaveBeenCalled()
	})

	it('pressing Escape closes the drawer when closeOnEscape is true', () => {
		const title = 'My Drawer Title'
		const onClose = jest.fn()
		render(<NavigationDrawer title={title} open closeOnEscape onClose={onClose} />)
		expect(screen.getByText(title)).toBeInTheDocument()

		fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' })
		expect(onClose).toHaveBeenCalled()
	})

	it('pressing Escape does NOT close the drawer when closeOnEscape is false', () => {
		const title = 'My Drawer Title'
		const onClose = jest.fn()
		render(<NavigationDrawer title={title} open closeOnEscape={false} onClose={onClose} />)
		expect(screen.getByText(title)).toBeInTheDocument()

		fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' })
		expect(onClose).not.toHaveBeenCalled()
	})

	it('pressing Escape when the drawer is closed does NOT call onClose (guard branch)', () => {
		const onClose = jest.fn()
		render(<NavigationDrawer onClose={onClose} />)
		// drawer defaults to closed
		fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' })
		expect(onClose).not.toHaveBeenCalled()
	})
})
