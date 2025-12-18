import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PillButton } from '~/packages/core'
import FilterIcon from '../../icons/FilterIcon'

describe('PillButton (Component)', () => {
	const label = 'Button Content'

	it('Renders correct root tag by default', () => {
		render(<PillButton>{label}</PillButton>)
		expect(screen.getByRole('tab', { name: label })).toBeInTheDocument()
		expect(screen.getByRole('tab', { name: label })).not.toHaveAttribute('aria-selected')
	})

	it('Renders selected accessibility tagging correctly', () => {
		render(<PillButton selected>{label}</PillButton>)
		expect(screen.getByRole('tab', { name: label })).toHaveAttribute('aria-selected', 'true')
	})

	it('Renders icon element when the prop is supplied', () => {
		render(<PillButton icon={FilterIcon}>{label}</PillButton>)
		const svg = document.querySelector('svg')
		expect(svg).toBeInTheDocument()
	})

	it('Fires the click event when the prop is supplied', async () => {
		const clickFn = jest.fn()
		render(
			<PillButton onClick={clickFn} icon={FilterIcon}>
				{label}
			</PillButton>,
		)
		const pill = screen.getByRole('tab', { name: label })
		await userEvent.click(pill)
		expect(clickFn).toHaveBeenCalledTimes(1)
		await userEvent.keyboard(' ')
		expect(clickFn).toHaveBeenCalledTimes(2)
	})
})
