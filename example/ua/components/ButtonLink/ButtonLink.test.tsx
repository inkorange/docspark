import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { ButtonLink } from './ButtonLink'

describe('ButtonLink (Component)', () => {
	const label = 'My Button'

	it('Renders correct root tag by default', () => {
		const { container } = render(<ButtonLink>{label}</ButtonLink>)
		expect(container.querySelector('a')).toBeInTheDocument()
	})

	it('Renders defined root tag', () => {
		const { container } = render(<ButtonLink as="div">{label}</ButtonLink>)
		expect(container.querySelector('div')).toBeInTheDocument()
	})
})
