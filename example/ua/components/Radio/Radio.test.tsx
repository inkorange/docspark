import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Radio } from './Radio'

describe('Radio (Component)', () => {
	afterEach(() => jest.resetAllMocks())

	it('Renders component by default', async () => {
		const onChangeFn = jest.fn()
		render(<Radio id="testId" name="testName" onChange={onChangeFn} />)
		const radioInput = screen.getByRole('radio')
		expect(radioInput).not.toBeChecked()
		await userEvent.click(radioInput)

		expect(radioInput).toBeChecked()
		expect(onChangeFn).toHaveBeenCalled()
	})

	it('Component checked by default', async () => {
		render(
			<Radio id="testId" checked name="testName">
				Label for this Radio
			</Radio>,
		)
		const radioInput = screen.getByRole('radio')
		expect(radioInput).toBeChecked()
		expect(screen.getByText('Label for this Radio')).toBeInTheDocument()
	})

	it('Component does not fire the onChange callback', async () => {
		render(<Radio id="testId" name="testName" />)
		const radioInput = screen.getByRole('radio')
		await userEvent.click(radioInput)
		expect(radioInput).toBeChecked()
	})
})
