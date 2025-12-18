import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Card } from './Card'

describe('Card (Component)', () => {
	const label = 'Card Content'

	it('Renders correct root tag by default', () => {
		const { container } = render(<Card>{label}</Card>)
		expect(container.querySelector('div')).toBeInTheDocument()
	})

	it('Renders defined root tag', () => {
		const { container } = render(<Card as="section">{label}</Card>)
		expect(container.querySelector('section')).toBeInTheDocument()
	})

	it('Adds appropriate styles when in an error state', () => {
		render(
			<Card error selected data-testid="card-test">
				{label}
			</Card>,
		)
		const rootEl = screen.getByTestId('card-test')
		expect(rootEl).toBeInTheDocument()
		expect(rootEl).toHaveAttribute('class', 'card  card--error')
		expect(rootEl).toHaveAttribute('data-selected', 'true')
	})

	it('Fires the click event when the prop is supplied', async () => {
		const clickFn = jest.fn()
		render(
			<Card onClick={clickFn} error selected data-testid="card-test">
				{label}
			</Card>,
		)
		const rootEl = screen.getByTestId('card-test')
		await userEvent.click(rootEl)
		expect(clickFn).toHaveBeenCalledTimes(1)
		await userEvent.keyboard(' ')
		expect(clickFn).toHaveBeenCalledTimes(2)
	})
})
