import { EditableCard } from './EditableCard'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('EditableCard', () => {
	it('Renders the default card', () => {
		render(<EditableCard>This is the content</EditableCard>)
		expect(screen.queryByRole('group')).not.toBeInTheDocument()
		expect(screen.queryByRole('alert')).not.toBeInTheDocument()
	})

	it('Renders the actionable buttons', async () => {
		const onEditFn = jest.fn()
		const onRemoveFn = jest.fn()

		render(
			<EditableCard onEdit={onEditFn} onRemove={onRemoveFn}>
				This is the content
			</EditableCard>,
		)
		expect(screen.getByRole('group')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument()

		await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
		expect(onEditFn).toHaveBeenCalled()

		await userEvent.click(screen.getByRole('button', { name: 'Remove' }))
		expect(onRemoveFn).toHaveBeenCalled()
	})

	it('Renders the error message', async () => {
		render(<EditableCard errorMessage="There is an error">This is the content</EditableCard>)
		expect(screen.getByRole('alert')).toBeInTheDocument()
		expect(screen.getByRole('alert')).toHaveTextContent('There is an error')
	})
})
