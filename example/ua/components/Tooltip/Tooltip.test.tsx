import { act, render, screen, fireEvent } from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import { Tooltip } from './Tooltip'

const testData: React.ComponentProps<typeof Tooltip> = { body: 'ToolTip Title', title: 'here is a headline' }
const testDataComplex: React.ComponentProps<typeof Tooltip> = {
	body: (
		<>
			<h3>ToolTip H3 Title</h3>
			<p>Paragraph content</p>
		</>
	),
	title: 'here is a headline',
}

describe('Tooltip (Component)', () => {
	// NOTE: The following tests are unreliable without Cypress/Playwright. We should consider testing with those tools.
	it.todo('Reveals the `tooltip` when the icon is `:hover`ed (Cypress/Playwright)')
	it.todo('Reveals the `tooltip` when the icon is `:focus`ed (Cypress/Playwright)')

	describe('API', () => {
		it('Adds a title to the `tooltip` content if one is provided', () => {
			// Render with title
			const { rerender } = render(<Tooltip body={testData.body} title={testData.title} />)
			const title = screen.getByText(testData.title as string)
			expect(title).toBeInTheDocument()

			// Re-render with new title
			const newTitle = 'My new title'
			rerender(<Tooltip body={testData.body} title={newTitle} />)
			expect(title).toHaveTextContent(newTitle)

			// Re-render with no title
			rerender(<Tooltip body={testData.body} title="" />)
			expect(title).not.toBeInTheDocument()
		})

		it('Renders HTML content in the body', () => {
			const { rerender } = render(<Tooltip body={testDataComplex.body} title={testDataComplex.title} />)
			const bodyH3 = screen.getByRole('heading', { level: 3 })
			expect(bodyH3).toHaveTextContent('ToolTip H3 Title')
			expect(screen.getByText('Paragraph content')).toBeInTheDocument()
		})

		it('Replaces the underlying icon button content with the provided content', () => {
			// Render WITHOUT custom content
			const { rerender } = render(<Tooltip body={testData.body} />)
			const iconButton = screen.getByRole('button')

			// eslint-disable-next-line testing-library/no-node-access -- No other way to test this, sadly
			const icon = iconButton.firstChild
			expect(icon).toBeInTheDocument()

			// Re-render WITH custom content
			const iconLabel = 'My Icon'
			rerender(
				<Tooltip body={testData.body}>
					<svg role="presentation" aria-label={iconLabel} />
				</Tooltip>,
			)

			const customIcon = screen.getByRole('presentation', { name: iconLabel })
			expect(screen.getByRole('button')).toContainElement(customIcon)
			expect(icon).not.toBeInTheDocument()
		})

		it('Handles forced positioning', () => {
			// Render WITHOUT custom content
			render(<Tooltip force body={testData.body} />)
			const iconButton = screen.getByRole('button')

			// eslint-disable-next-line testing-library/no-node-access -- No other way to test this, sadly
			const icon = iconButton.firstChild
			expect(icon).toBeInTheDocument()
		})

		it('Handles forced positioning', () => {
			// Render WITHOUT custom content
			render(<Tooltip icon="info" body={testData.body} />)
			const iconButton = screen.getByRole('button')

			// eslint-disable-next-line testing-library/no-node-access -- No other way to test this, sadly
			const icon = iconButton.firstChild
			expect(icon).toBeInTheDocument()
		})
	})

	describe('Positioning Logic', () => {
		beforeEach(() => {
			jest.useFakeTimers()
		})

		afterEach(() => {
			jest.useRealTimers()
		})

		it('Will evaluate the position to be above the page, and render it below', () => {
			Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
				configurable: true,
				value: () => ({ top: -20 }),
			})

			const { container } = render(<Tooltip location="top" body={testData.body} />)
			expect(container.getElementsByTagName('div')[0]).toHaveAttribute('data-location', 'bottom')
		})

		it('Will evaluate the position to be below the page, and render it above', () => {
			Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
				configurable: true,
				value: () => ({ top: 700, height: 200 }),
			})

			const { container } = render(<Tooltip location="bottom" body={testData.body} />)
			expect(container.getElementsByTagName('div')[0]).toHaveAttribute('data-location', 'top')
		})

		it('Will evaluate the position to be right the page, and render it accordingly', () => {
			Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
				configurable: true,
				value: () => ({ top: 0, left: 900, width: 400 }),
			})

			const { container, rerender } = render(<Tooltip location="bottom" body={testData.body} />)
			expect(container.getElementsByTagName('div')[0]).toHaveAttribute('data-location', 'bottom')
		})

		it('Will evaluate the position to be left the page, and render it accordingly', () => {
			Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
				configurable: true,
				value: () => ({ top: 0, left: -200, width: 400 }),
			})

			const { container, rerender } = render(<Tooltip force location="bottom" body={testData.body} />)
			expect(container.getElementsByTagName('div')[0]).toHaveAttribute('data-location', 'bottom')
		})

		it('Will handle and respond to window resize events', async () => {
			const { container, rerender } = render(<Tooltip location="bottom" body={testData.body} />)
			jest.advanceTimersByTime(500)
			await act(() => fireEvent.resize(window))
			jest.advanceTimersByTime(500)
			expect(container.getElementsByTagName('div')[0]).toHaveAttribute('data-location', 'bottom')
		})
	})

	/*
	 * TODO: Need to consider accessibility approach for "non-tooltip 'tooltips'".
	 * See https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role
	 */
	describe('Accessibility Relationships', () => {
		it('Describes the icon button by using the `tooltip`', async () => {
			render(<Tooltip title={testData.title} body={testData.body} />)
			const accessibleTooltipMessage = `${testData.title} ${testData.body}`

			await userEvent.tab()
			const iconButton = screen.getByRole('button')
			expect(iconButton).toHaveFocus()
			expect(iconButton).toHaveAccessibleDescription(accessibleTooltipMessage)

			const tooltip = screen.getByRole('tooltip')
			expect(tooltip).toHaveAccessibleName(accessibleTooltipMessage)
		})
	})

	describe('Cancellability', () => {
		it('Focuses and unFocuses Target when tabbed in and `Escape` is pressed', async () => {
			const { rerender } = render(<Tooltip body={testData.body} />)

			const iconButton = screen.getByRole('button')
			expect(iconButton).not.toHaveFocus()
			rerender(<Tooltip body={testData.body} />)
			await userEvent.tab()
			expect(iconButton).toHaveFocus()

			expect(screen.getByRole('tooltip', { name: testData.body as string })).toBeInTheDocument()

			await userEvent.keyboard('{Escape}')
			expect(screen.queryByRole('tooltip', { name: testData.body as string })).not.toBeInTheDocument()
			expect(iconButton).not.toHaveFocus()
		})

		it('Reverts any forceful concealment of the `tooltip` when the icon is clicked or left', async () => {
			render(<Tooltip body={testData.body} />)
			const iconButton = screen.getByRole('button')

			// Tooltip is initially opened when focused
			await userEvent.tab()
			expect(screen.getByRole('tooltip', { name: testData.body as string })).toBeInTheDocument()

			// Tooltip is closed when `Escape`d
			await userEvent.keyboard('{Escape}')
			expect(screen.queryByRole('tooltip', { name: testData.body as string })).not.toBeInTheDocument()
			expect(iconButton).not.toHaveFocus()

			// Tooltip is re-exposed when clicked
			await userEvent.click(iconButton)
			expect(screen.getByRole('tooltip', { name: testData.body as string })).toBeInTheDocument()

			// Re-close Tooltip
			await userEvent.keyboard('{Escape}')
			expect(iconButton).not.toHaveFocus()

			// Tooltip is re-exposed when left
			await userEvent.keyboard('{Tab}{Tab}') // Leave and then re-visit icon button
			expect(screen.getByRole('tooltip', { name: testData.body as string })).toBeInTheDocument()
		})
	})
})
