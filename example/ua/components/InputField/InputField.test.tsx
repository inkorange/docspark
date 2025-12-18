import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import { InputField } from './InputField'

describe('InputField (Component)', () => {
	it('Renders an input field', async () => {
		render(<InputField id="first-name" name="firstName" defaultValue="" required label="Firstname" />)
		const inputEl = screen.getByRole('textbox', { name: 'Firstname' })
		expect(inputEl).toHaveAttribute('required')
		expect(screen.getByRole('alert')).toBeInTheDocument()
		expect(inputEl).toHaveValue('')
		await userEvent.type(inputEl, 'Myname')
		expect(inputEl).toHaveValue('Myname')
	})

	it('Does not renders an error field if none is specified', async () => {
		render(<InputField id="first-name" name="firstName" defaultValue="" label="Firstname" noValidate />)
		expect(screen.queryByRole('alert')).not.toBeInTheDocument()
	})

	it('Will not have the required attribute on the input', async () => {
		render(<InputField id="first-name" name="firstName" defaultValue="" label="Firstname" />)
		const inputEl = screen.getByRole('textbox')
		expect(inputEl).not.toHaveAttribute('required')
	})

	it('Will render a prefix label on the input', async () => {
		render(<InputField name="firstName" floatingLabel={false} defaultValue="" prefixLabel="Hi" label="Firstname" />)
		const inputEl = screen.getByRole('textbox')
		expect(screen.getByTestId('prefixLabel')).toBeInTheDocument()

		expect(inputEl).not.toHaveAttribute('required')
		expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', ' ')
	})

	it('Will render the correct placeholder', async () => {
		const { container } = render(
			<InputField name="firstName" placeholder={null} defaultValue="" prefixLabel="Hi" label="Firstname" />,
		)
		expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', ' ')
		expect(container.getElementsByTagName('div')[0]).toHaveClass('form-field--floating-field')
	})

	it('Will render the correct label when none is supplied and we have a placeholder', async () => {
		const { container } = render(
			<InputField defaultValue={null} label="" name="firstName" placeholder={'new label'} prefixLabel="Hi" />,
		)
		expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'new label')
		expect(screen.getByRole('textbox')).toHaveValue('')
	})

	it('Will render character count when enabled', async () => {
		render(
			<InputField
				id="char-count-test"
				name="charCountInput"
				label="Test Input"
				showCharacterCount={true}
				maxLength={20}
				defaultValue=""
			/>,
		)
		const inputEl = screen.getByRole('textbox', { name: 'Test Input' })

		// Should show initial character count (20 - 0 = 20 remaining)
		let characterCountElement = screen.getByText('characters remaining')
		expect(characterCountElement).toBeInTheDocument()
		expect(characterCountElement).toHaveClass('character-count-label')

		// Type 5 characters
		await userEvent.type(inputEl, 'Hello')
		characterCountElement = screen.getByText('characters remaining')
		expect(characterCountElement).toBeInTheDocument()
		expect(characterCountElement).toHaveClass('character-count-label')

		// Type more to reach near max
		await userEvent.type(inputEl, 'World!')
		characterCountElement = screen.getByText('characters remaining')
		expect(characterCountElement).toBeInTheDocument()
		expect(characterCountElement).toHaveClass('character-count-label')
	})

	it('Will throw an error when render character count is enabled but maxLength is not supplied', async () => {
		const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

		render(
			<InputField
				id="no-max-length"
				name="noMaxLengthInput"
				label="Test Input"
				showCharacterCount={true}
				defaultValue=""
			/>,
		)

		expect(consoleSpy).toHaveBeenCalledWith(
			expect.stringContaining('showCharacterCount is enabled but maxLength is not set'),
		)

		consoleSpy.mockRestore()
	})

	it('Will still fire a passed in onChange callback when render character count is enabled', async () => {
		const mockOnChange = jest.fn()

		render(
			<InputField
				id="callback-test"
				name="callbackInput"
				label="Test Input"
				showCharacterCount={true}
				maxLength={20}
				onChange={mockOnChange}
				defaultValue=""
			/>,
		)

		const inputEl = screen.getByRole('textbox', { name: 'Test Input' })

		// Type some text
		await userEvent.type(inputEl, 'Test')

		// onChange should have been called 4 times (once per character)
		expect(mockOnChange).toHaveBeenCalledTimes(4)

		// Verify the last call's event target value
		const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0]
		expect(lastCall.target.value).toBe('Test')
	})
})
