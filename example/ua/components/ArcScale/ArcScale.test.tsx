import { render } from '@testing-library/react'
import { ArcScale } from './ArcScale'

describe('ArcScale', () => {
	it('renders the component', () => {
		render(<ArcScale />)
		// eslint-disable-next-line testing-library/no-node-access
		const svg = document.querySelector('svg')
		expect(svg).toBeInTheDocument()
	})
	it('handles impossible numbers', () => {
		render(<ArcScale fillPercentage={110} />)
		// eslint-disable-next-line testing-library/no-node-access
		const svg = document.querySelector('svg')
		expect(svg).toBeInTheDocument()
	})
})
