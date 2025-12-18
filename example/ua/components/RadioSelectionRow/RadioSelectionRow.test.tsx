import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RadioSelectionRow } from './RadioSelectionRow'
import { Radio } from '~/packages/core'

describe('RadioSelectionRow (Component)', () => {
	afterEach(() => jest.resetAllMocks())

	it('Renders component by default', async () => {
		const onClickFn = jest.fn()
		render(<RadioSelectionRow id="testId" name="testName" isChecked={false} onClick={onClickFn} />)
		const radioInput = screen.getByRole('radio')
		expect(radioInput).not.toBeChecked()
		await userEvent.click(radioInput)
		expect(onClickFn).toHaveBeenCalled()
	})

	it('Will render the edit button when configured', async () => {
		const onEditFn = jest.fn()
		render(<RadioSelectionRow id="testId" name="testName" isChecked={true} onEdit={onEditFn} />)
		const radioInput = screen.getByRole('radio')
		expect(radioInput).toBeChecked()
		const editButton = screen.getByRole('button', { name: 'Edit' })
		expect(editButton).toBeVisible()
		await userEvent.click(editButton)
		expect(onEditFn).toHaveBeenCalled()
	})

	it('Component does not fire the onChange callback', async () => {
		render(<RadioSelectionRow id="testId" name="testName" isChecked={false} />)
		const radioInput = screen.getByRole('radio')
		await userEvent.click(radioInput)
		expect(radioInput).not.toBeChecked()
	})
})
