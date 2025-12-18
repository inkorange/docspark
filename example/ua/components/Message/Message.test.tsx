import { render, screen } from '@testing-library/react'
import { Message } from '../../components/Message/Message'

describe('Message', () => {
	it('renders default display settings', () => {
		render(<Message>Simple Message</Message>)
		expect(screen.getByRole('alert')).toBeInTheDocument()
		expect(screen.getByLabelText('alert')).toBeInTheDocument()
		expect(screen.getByRole('alert')).toHaveTextContent('Simple Message')
	})

	it('renders error variant correctly', () => {
		render(<Message type="error">Simple Message</Message>)
		expect(screen.getByRole('alert')).toBeInTheDocument()
		expect(screen.getByLabelText('error')).toBeInTheDocument()
	})

	it('renders text without icon variant correctly', () => {
		render(<Message type="text">Simple Message</Message>)
		expect(screen.queryByLabelText('text')).not.toBeInTheDocument()
	})
})
