import { screen, render } from '@testing-library/react'

import { QuoteBlock } from './QuoteBlock'

describe('QuoteBlock component', () => {
	it('does not render w/o children', () => {
		render(<QuoteBlock />)
		expect(screen.queryByTestId('quote-block')).not.toBeInTheDocument()
	})

	it('renders with children', () => {
		render(
			<QuoteBlock>
				<div data-testid="test-child" />
			</QuoteBlock>,
		)
		expect(screen.getByTestId('quote-block')).toBeInTheDocument()
		expect(screen.getByTestId('test-child')).toBeInTheDocument()
	})
})
