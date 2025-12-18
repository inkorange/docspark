import { render } from '@testing-library/react'
import { UaSkeleton } from './UaSkeleton'

describe('UaSkeleton', () => {
	it('should render the default styling', () => {
		const { container } = render(<UaSkeleton />)
		const rootDiv = container.getElementsByTagName('div')[0]
		expect(rootDiv).toBeInTheDocument()
		expect(rootDiv).toHaveAttribute('style', 'background-color: lightgray; border-radius: 0;')
	})

	it('should render the radius accordingly', () => {
		const { container } = render(<UaSkeleton cornerRadius="4px" />)
		const rootDiv = container.getElementsByTagName('div')[0]
		expect(rootDiv).toBeInTheDocument()
		expect(rootDiv).toHaveAttribute('style', 'background-color: lightgray; border-radius: 4px;')
	})

	it('should render the text variant accordingly', () => {
		const { container } = render(<UaSkeleton variant="text" />)
		const rootDiv = container.getElementsByTagName('div')[0]
		expect(rootDiv).toBeInTheDocument()
		expect(rootDiv).toHaveAttribute('style', 'background-color: lightgray; border-radius: var(--border-radius-small);')
	})

	it('should render the circular variant accordingly', () => {
		const { container } = render(<UaSkeleton variant="circular" />)
		const rootDiv = container.getElementsByTagName('div')[0]
		expect(rootDiv).toBeInTheDocument()
		expect(rootDiv).toHaveAttribute('style', 'background-color: lightgray; border-radius: 50%;')
	})
})
