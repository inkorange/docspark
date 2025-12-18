import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { IconButton } from '~/packages/core'
import AlertCircleOutlineIcon from '../../icons/AlertCircleIcon'

describe('IconButton (Component)', () => {
	const label = 'Button Content'

	it('Renders correct root tag by default', () => {
		render(<IconButton icon={AlertCircleOutlineIcon} label={label} />)
		expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
	})
})
