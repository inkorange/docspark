import { TextTruncated } from './TextTruncated'
import { render, screen } from '@testing-library/react'

describe('TextTruncated', () => {
	it('shoulds split text', () => {
		render(
			<div style={{ width: '400px' }}>
				<TextTruncated text="12345678910123456" splitRatio={0.5} />
			</div>,
		)
		const el = screen.getByTitle('12345678910123456')
		const firstHalf = screen.getByTestId('truncated-first-half')
		expect(el).toBeInTheDocument()
		expect(el.textContent).toBe('12345678910123456')
		expect(firstHalf).toHaveTextContent('123456789')
	})

	it('renders defaults when no splitRatio supplied', () => {
		render(
			<div style={{ width: '400px' }}>
				<TextTruncated text="12345678910123456" />
			</div>,
		)
		const el = screen.getByTitle('12345678910123456')
		const firstHalf = screen.getByTestId('truncated-first-half')
		expect(el).toBeInTheDocument()
		expect(el.textContent).toBe('12345678910123456')
		expect(firstHalf).toHaveTextContent('123456789')
	})

	it('handles shorter strings', () => {
		render(
			<div style={{ width: '400px' }}>
				<TextTruncated text="1" />
			</div>,
		)
		const el = screen.getByTitle('1')
		const firstHalf = screen.getByTestId('truncated-first-half')
		expect(el).toBeInTheDocument()
		expect(el.textContent).toBe('1')
		expect(firstHalf).toHaveTextContent('1')
	})
})
