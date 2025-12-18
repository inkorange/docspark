import '@testing-library/jest-dom'

import React from 'react'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Accordion, AccordionPanel } from './Accordion'

describe('Accordion', () => {
	it('renders content correct', () => {
		render(
			<Accordion>
				<AccordionPanel summary="This is the title bar">Accordion content area</AccordionPanel>
			</Accordion>,
		)
		const AccordionItem = screen.getByTestId('accordion-detail')
		expect(screen.getByRole('button')).toHaveTextContent('This is the title bar')
		expect(AccordionItem).toHaveTextContent('Accordion content area')
		expect(AccordionItem).toHaveAttribute('aria-expanded', String(false))
	})

	it('updates the aria attribute when open', async () => {
		render(
			<Accordion>
				<AccordionPanel summary="This is the title bar">Accordion content area</AccordionPanel>
			</Accordion>,
		)
		const AccordionItem = screen.getByTestId('accordion-detail')
		await userEvent.click(screen.getByRole('button'))
		// eslint-disable-next-line testing-library/no-node-access,testing-library/no-container
		expect(AccordionItem).toHaveAttribute('aria-expanded', String(true))
	})

	it('renders multiple Accordion slots and opens the appropriate one reactively', async () => {
		function Wrapper() {
			const [expandedIdx, setExpandedIdx] = React.useState(1)
			return (
				<Accordion theme="small">
					<AccordionPanel expanded={expandedIdx === 0} summary="This is the title bar 1">
						Accordion content area 1
					</AccordionPanel>
					<AccordionPanel expanded={expandedIdx === 1} summary="This is the title bar 2">
						Accordion content area 2
					</AccordionPanel>
					<AccordionPanel expanded={expandedIdx === 2} summary="This is the title bar 3">
						Accordion content area 3
					</AccordionPanel>
					<button onClick={() => setExpandedIdx(2)}>Expand 3</button>
				</Accordion>
			)
		}
		const { container } = render(<Wrapper />)
		// eslint-disable-next-line testing-library/no-node-access,testing-library/no-container
		expect(container.querySelector('div')).toHaveClass('accordion--container-small')
		const AccordionItems = screen.getAllByTestId('accordion-detail')
		expect(AccordionItems).toHaveLength(3)
		expect(AccordionItems[1]).toHaveAttribute('aria-expanded', String(true))
		// Now simulate parent changing expanded prop
		await userEvent.click(screen.getByText('Expand 3'))
		expect(AccordionItems[1]).toHaveAttribute('aria-expanded', String(false))
		expect(AccordionItems[2]).toHaveAttribute('aria-expanded', String(true))
	})

	it('renders large theme when configured', async () => {
		const { container } = render(
			<Accordion theme="large">
				<AccordionPanel summary="This is the title bar 1">Accordion content area 1</AccordionPanel>
			</Accordion>,
		)
		// eslint-disable-next-line testing-library/no-node-access,testing-library/no-container
		expect(container.querySelector('div')).toHaveClass('accordion--container-large')
	})

	it('toggles the Accordion when the spacebar is clicked', async () => {
		render(
			<Accordion>
				<AccordionPanel summary="This is the title bar">Accordion content area</AccordionPanel>
			</Accordion>,
		)
		const AccordionItem = screen.getByTestId('accordion-detail')
		await userEvent.click(screen.getByRole('button'))
		expect(AccordionItem).toHaveAttribute('aria-expanded', String(true))
		await userEvent.keyboard(' ')
		expect(AccordionItem).toHaveAttribute('aria-expanded', String(false))
		await userEvent.keyboard('[Space]')
		expect(AccordionItem).toHaveAttribute('aria-expanded', String(true))
	})

	it('will not toggle the Accordion when disabled', async () => {
		const expandHandler = jest.fn()
		const collapseHandler = jest.fn()
		render(
			<Accordion>
				<AccordionPanel disabled summary="This is the title bar" onExpand={expandHandler} onCollapse={collapseHandler}>
					Accordion content area
				</AccordionPanel>
			</Accordion>,
		)
		const AccordionItem = screen.getByTestId('accordion-detail')
		await userEvent.click(screen.getByRole('button'))
		expect(AccordionItem).toHaveAttribute('aria-expanded', String(false))
		expect(expandHandler).toHaveBeenCalledTimes(0)
		expect(collapseHandler).toHaveBeenCalledTimes(0)
	})

	it('Execute onExpand callback when accordion is expanded given its not disabled', async () => {
		const expandHandler = jest.fn()
		const collapseHandler = jest.fn()
		render(
			<Accordion>
				<AccordionPanel summary="This is the title bar" onExpand={expandHandler} onCollapse={collapseHandler}>
					Accordion content area
				</AccordionPanel>
			</Accordion>,
		)
		const AccordionItem = screen.getByTestId('accordion-detail')
		// Accordion expands
		await userEvent.click(screen.getByRole('button'))
		expect(AccordionItem).toHaveAttribute('aria-expanded', String(true))
		expect(expandHandler).toHaveBeenCalledTimes(1)
		// Accordion collapse
		await userEvent.click(screen.getByRole('button'))
		expect(AccordionItem).toHaveAttribute('aria-expanded', String(false))
		expect(collapseHandler).toHaveBeenCalledTimes(1)
	})

	it('will render without the arrow if configured on the AccordionPanel', async () => {
		render(
			<Accordion>
				<AccordionPanel showArrow={false} disabled summary="This is the title bar">
					Accordion content area
				</AccordionPanel>
			</Accordion>,
		)
		const AccordionHeading = screen.getByRole('button')
		expect(AccordionHeading).toHaveClass('accordion--heading-noarrow')
		expect(AccordionHeading.getElementsByTagName('svg')).toHaveLength(0)
	})
})
