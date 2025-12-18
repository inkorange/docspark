import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar (Component)', () => {
	it('Renders component by default', () => {
		const { container } = render(<ProgressBar step={1} totalSteps={5} />)
		expect(container.getElementsByTagName('rect')[1]).toHaveAttribute('width', '40%')
	})
})
