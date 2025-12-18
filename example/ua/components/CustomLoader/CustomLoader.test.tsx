import { render, screen } from '@testing-library/react'

import { CustomLoader } from './CustomLoader'

describe('CustomLoader (Component)', () => {
	it('Loads the animated loader correctly', () => {
		render(
			<div>
				<div id="custom-loader" />
				<CustomLoader delay={false} />
			</div>,
		)
		expect(screen.getByTestId('custom-loader')).toBeInTheDocument()
		expect(screen.getByTestId('animated-loader')).toBeInTheDocument()
		expect(screen.getByTestId('custom-loader')).toBeVisible()
	})

	it('Does not render the animated loader', () => {
		render(
			<div>
				<div id="custom-loader" />
				<CustomLoader animate={false} delay={false} />
			</div>,
		)
		expect(screen.getByTestId('custom-loader')).toBeInTheDocument()
		expect(screen.queryByTestId('animated-loader')).not.toBeInTheDocument()
	})

	it('Applies correct style of delaying loader visibility', () => {
		render(
			<div>
				<div id="custom-loader" />
				<CustomLoader show={false} />
			</div>,
		)
		expect(screen.getByTestId('custom-loader')).toHaveClass('show-intent')
		expect(screen.getByTestId('custom-loader')).not.toHaveClass('loader-base--show')
	})

	it('Applies correct style of showing visibility', () => {
		render(
			<div>
				<div id="custom-loader" />
				<CustomLoader show={true} />
			</div>,
		)
		expect(screen.getByTestId('custom-loader')).toHaveClass('loader-base--show')
	})
})
