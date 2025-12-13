import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { LoadingDots } from './LoadingDots'

describe('LoadingDots (Component)', () => {
	const label = 'Button Content'

	it('Renders correct base shape by default', () => {
		const { container } = render(<LoadingDots />)
		expect(container.getElementsByTagName('svg')[0]).toBeInTheDocument()
		expect(container.getElementsByTagName('circle')[0]).toBeInTheDocument()
	})

	it('Renders rect shopes when configured', () => {
		const { container } = render(<LoadingDots shape="rect" />)
		expect(container.getElementsByTagName('svg')[0]).toBeInTheDocument()
		expect(container.getElementsByTagName('rect')[0]).toBeInTheDocument()
	})
})
