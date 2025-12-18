import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import { Checkbox, ensureBoolean } from '../../components/Checkbox/Checkbox'

describe('Checkbox (Component)', () => {
	it('Renders an input field of type checkbox', async () => {
		render(
			<Checkbox
				id="first-name"
				name="firstName"
				className="checkbox-class"
				defaultChecked={false}
				required
				label="Firstname"
			/>,
		)
		expect(screen.getByLabelText('Firstname')).toBeInTheDocument()
		const inputEl = screen.getByRole('checkbox')
		expect(inputEl).toHaveAttribute('required')
		expect(inputEl).toHaveClass('checkbox-class')
		expect(inputEl).not.toBeChecked()
		await userEvent.click(inputEl)
		expect(inputEl).toBeChecked()
	})

	it('Will not have the required attribute on the input', async () => {
		render(<Checkbox id="first-name" name="firstName" defaultChecked={false} label="Firstname" />)
		const inputEl = screen.getByRole('checkbox')
		expect(inputEl).not.toHaveAttribute('required')
	})

	it('Will be pre-checked with a value by default', async () => {
		render(<Checkbox id="first-name" name="firstName" defaultChecked={true} label="Firstname" />)
		const inputEl = screen.getByRole('checkbox')
		expect(inputEl).toBeChecked()
	})

	it('Will render fallback id if none supplied', async () => {
		render(<Checkbox name="firstName" label="Firstname" />)
		const inputEl = screen.getByRole('checkbox')
		expect(inputEl).toHaveAttribute('id')
		expect(inputEl).not.toBeChecked()
	})

	it('Will render small styles ', async () => {
		const { container } = render(<Checkbox name="firstName" small label="Firstname" />)
		const labelEl = container.getElementsByTagName('label')[0]
		expect(labelEl).toHaveAttribute('class', 'small-label')
	})

	describe('focus behavior', () => {
		it('should focus on click', () => {
			render(<Checkbox name="firstName" defaultChecked={false} label="Firstname" />)
			const inputEl = screen.getByRole('checkbox')
			fireEvent.click(inputEl)
			expect(inputEl).toHaveFocus()
		})
	})

	describe('event listeners', () => {
		it('should add and remove event listener', () => {
			const addEventListenerSpy = jest.spyOn(HTMLElement.prototype, 'addEventListener')
			const removeEventListenerSpy = jest.spyOn(HTMLElement.prototype, 'removeEventListener')

			const { unmount } = render(<Checkbox name="checkboxName" defaultChecked={false} label="Checkbox Label" />)
			const checkbox = screen.getByRole('checkbox')

			expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))
			unmount()
			expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))

			addEventListenerSpy.mockRestore()
			removeEventListenerSpy.mockRestore()
		})
	})

	describe('ensureBoolean', () => {
		it('Returns truthy responses', async () => {
			expect(ensureBoolean(true)).toStrictEqual(true)
		})
		it('Returns falsy responses', async () => {
			expect(ensureBoolean(false)).toStrictEqual(false)
			expect(ensureBoolean(undefined)).toStrictEqual(false)
			expect(ensureBoolean(null)).toStrictEqual(false)
		})
	})
})
