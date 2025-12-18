import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import { PasswordField } from '../../components/PasswordField/PasswordField'

describe('PasswordField (Component)', () => {
	it('Renders an Password field', async () => {
		render(<PasswordField id="password" name="password" required label="Password" />)
		const inputEl = screen.getByLabelText('Password')
		expect(inputEl).toHaveAttribute('required')
		expect(screen.getByRole('alert')).toBeInTheDocument()
		expect(inputEl).toHaveValue('')
		await userEvent.type(inputEl, 'Password@123')
		expect(inputEl).toHaveValue('Password@123')
	})

	it('Should have mask button by default', async () => {
		render(<PasswordField name="password" label="Password" />)
		expect(screen.getByRole('switch')).toBeInTheDocument()
	})
	it('Hide mask button', async () => {
		render(<PasswordField name="password" label="Password" showMaskButton={false} />)
		expect(screen.queryByRole('switch')).not.toBeInTheDocument()
	})

	it('Will not have the required attribute on the input', async () => {
		render(<PasswordField name="password" label="Password" />)
		const inputEl = screen.getByLabelText('Password')
		expect(inputEl).not.toHaveAttribute('required')
	})

	it('Should toggle the password type when button is clicked', async () => {
		render(<PasswordField name="password" label="Important" />)
		const switchButton = screen.getByRole('switch')
		const inputEl = screen.getByLabelText('Important')
		expect(screen.getByRole('switch')).toBeInTheDocument()
		expect(inputEl).toHaveAttribute('type', 'password')
		await userEvent.click(switchButton)
		expect(inputEl).toHaveAttribute('type', 'text')
		await userEvent.click(switchButton)
		expect(inputEl).toHaveAttribute('type', 'password')
	})
})
