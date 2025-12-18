import { render, screen } from '@testing-library/react'
import { CircularProgress } from './CircularProgress'

describe('CircularProgress (Component)', () => {
	it('renders default component correctly', () => {
		const { container } = render(<CircularProgress />)
		expect(container.getElementsByTagName('svg')[0]).toBeInTheDocument()
	})
})
