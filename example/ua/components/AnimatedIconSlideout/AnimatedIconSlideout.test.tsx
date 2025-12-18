import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import { AnimatedIconSlideout } from './AnimatedIconSlideout'
import HangerIcon from '../../icons/HangerCircleIcon'

describe('AnimatedIconSlideout', () => {
	beforeEach(() => {
		jest.useFakeTimers()
	})

	afterEach(() => {
		jest.useRealTimers()
	})

	it('renders the component with automatic animation', async () => {
		const { container } = render(<AnimatedIconSlideout label="Label" icon={<HangerIcon size="XL" />} />)
		// eslint-disable-next-line testing-library/no-node-access
		const svg = document.querySelector('svg')
		const rootElement = container.getElementsByTagName('div')[0]
		const animatedRootElement = container.getElementsByTagName('div')[1]

		expect(screen.getByText('Label')).toBeInTheDocument()

		fireEvent.animationStart(animatedRootElement)

		await waitFor(() => expect(svg).toBeInTheDocument())
		expect(rootElement).toHaveClass('left')

		fireEvent.animationEnd(animatedRootElement)
		fireEvent.mouseOver(animatedRootElement)

		expect(rootElement).not.toHaveClass('left-hover')
	})

	it('renders the component with mouse over handling', async () => {
		const { container } = render(
			<AnimatedIconSlideout shouldTriggerOnHover={true} label="Label" icon={<HangerIcon size="XL" />} />,
		)
		// eslint-disable-next-line testing-library/no-node-access
		const rootElement = container.getElementsByTagName('div')[0]
		const animatedRootElement = container.getElementsByTagName('div')[1]
		fireEvent.mouseOver(animatedRootElement)
		await waitFor(() => expect(rootElement).toHaveClass('left-hover'))

		fireEvent.animationEnd(animatedRootElement)
		await waitFor(() => expect(rootElement).not.toHaveClass('left-hover'))
	})

	it('renders the component with a delay value', async () => {
		const delayVal = 500
		const { container } = render(
			<AnimatedIconSlideout delay={delayVal} label="Label" icon={<HangerIcon size="XL" />} />,
		)
		// eslint-disable-next-line testing-library/no-node-access
		const rootElement = container.getElementsByTagName('div')[0]

		expect(rootElement).not.toHaveClass('left-hover')

		jest.advanceTimersByTime(delayVal + 100)
		await waitFor(() => expect(rootElement).toHaveClass('left-hover'))
	})
})
