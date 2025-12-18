import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { DropMenu, DropMenuOption } from './DropMenu'

describe('DropMenu', () => {
	const dropdownOptionsChildren = (
		<>
			<DropMenuOption key="1">Option 1</DropMenuOption>
			<DropMenuOption key="2">Option 2</DropMenuOption>
		</>
	)
	const buttonChildren = <div>Button</div>

	const name = 'country'

	it('renders without crashing', () => {
		render(
			<DropMenu buttonLabel={buttonChildren} name={name}>
				{dropdownOptionsChildren}
			</DropMenu>,
		)
		expect(screen.getByTestId(`${name}-switcher`)).toBeInTheDocument()
	})

	it('renders dropdown options correctly', async () => {
		render(
			<DropMenu buttonLabel={buttonChildren} name={name}>
				{dropdownOptionsChildren}
			</DropMenu>,
		)

		await userEvent.click(screen.getByTestId(`${name}-switcher`))

		expect(screen.getByText('Option 1')).toBeInTheDocument()
		expect(screen.getByText('Option 2')).toBeInTheDocument()
	})

	it('closes when clicking outside of DropMenu', async () => {
		render(
			<DropMenu buttonLabel={buttonChildren} name={name}>
				{dropdownOptionsChildren}
			</DropMenu>,
		)

		// Assume your DropMenu toggle button has a role of "button"
		const button = screen.getByRole('button')

		// Open the DropMenu
		await userEvent.click(button)

		// Simulate a click outside of the DropMenu
		await userEvent.click(document.body)

		const dropdownMenu = screen.getByTestId(`${name}-switcher-menu`)
		expect(dropdownMenu).toHaveClass('dropdown__hidden')
	})

	it('fires open event', async () => {
		const onOpenMock = jest.fn()
		const onCloseMock = jest.fn()
		render(
			<DropMenu buttonLabel={buttonChildren} name={name} onOpen={onOpenMock} onClose={onCloseMock}>
				{dropdownOptionsChildren}
			</DropMenu>,
		)

		const button = screen.getByRole('button')
		await userEvent.click(button)

		expect(onOpenMock).toHaveBeenCalledTimes(1)
		expect(onCloseMock).not.toHaveBeenCalled()
	})

	it('renders function based children', async () => {
		const onCloseMock = jest.fn()

		const dropdownChildren = (handleClose: () => void) => (
			<>
				<DropMenuOption onClick={onCloseMock}>Option 1</DropMenuOption>
				<DropMenuOption>Option 2</DropMenuOption>
			</>
		)

		render(
			<DropMenu buttonLabel={buttonChildren} name={name}>
				{(onCloseMock) => dropdownChildren(onCloseMock)}
			</DropMenu>,
		)

		const button = screen.getByRole('button')
		expect(button).toHaveAttribute('aria-expanded', 'false')
		await userEvent.click(button)
		await waitFor(() => expect(screen.getByText('Option 1')).toBeVisible())
	})
})
