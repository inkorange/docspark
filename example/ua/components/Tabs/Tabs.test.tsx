import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import { Tabs, Tab, TabList, TabPanel } from './Tabs'

// Used for the `className` tests in the `API` section
jest.mock('../../components/shared/Tabs.module.scss', () => ({ tabs: getBaseClass() }))
function getBaseClass(): 'tabs' {
	return 'tabs'
}

describe('Tabs (Component)', () => {
	/* -------------------- Constants + Helpers -------------------- */
	const tabListLabel = 'Test Tab List'
	const tabIds = ['first-tab', 'second-tab', 'third-tab', 'last-tab']
	const tabLabels = ['First Tab', 'Second Tab', 'Third Tab', 'Last Tab']
	const tabPanelContents = ['First Panel', 'Second Panel', 'Third Panel', 'Last Panel']

	function renderComponentWithProps(props: Omit<React.ComponentProps<typeof Tabs>, 'children'> = {}) {
		return render(
			<Tabs {...props}>
				<TabList aria-label={tabListLabel}>
					{tabIds.map((id, i) => (
						<Tab key={id} id={id}>
							{tabLabels[i]}
						</Tab>
					))}
				</TabList>

				{tabPanelContents.map((text) => (
					<TabPanel key={text}>{text}</TabPanel>
				))}
			</Tabs>,
		)
	}

	/* -------------------- Tests -------------------- */
	describe('API', () => {
		it('Starts off with the FIRST `tab` selected by DEFAULT', () => {
			renderComponentWithProps()
			expect(screen.getByRole('tab', { selected: true })).toBe(screen.getByRole('tab', { name: tabLabels[0] }))
		})

		it('Starts off with the SPECIFIED `tab` selected', () => {
			const initialTab = 2
			renderComponentWithProps({ initialTab })
			expect(screen.getByRole('tab', { selected: true })).toBe(screen.getByRole('tab', { name: tabLabels[initialTab] }))
		})

		it('Accepts _additional_ classes for the component', () => {
			const additionalClass = 'my-test-class'
			renderComponentWithProps({ className: additionalClass })

			// eslint-disable-next-line testing-library/no-node-access -- Necessary for getting component container
			const componentContainer = screen.getByRole('tablist').parentNode as HTMLDivElement
			expect(componentContainer).toHaveClass(getBaseClass())
			expect(componentContainer).toHaveClass(additionalClass)
		})

		it('Accepts a _complete override_ of the classes for the component', () => {
			const overridingClass = 'my-overriding-class'
			renderComponentWithProps({ classNameOverride: overridingClass })

			// eslint-disable-next-line testing-library/no-node-access -- Necessary for getting component container
			const componentContainer = screen.getByRole('tablist').parentNode as HTMLDivElement
			expect(componentContainer).not.toHaveClass(getBaseClass())
			expect(componentContainer).toHaveClass(overridingClass)
		})

		it('Handles the selectedTabId change', () => {
			const handleTabChange = jest.fn()
			const { rerender } = render(
				<Tabs initialTab={0} onTabChange={handleTabChange}>
					<TabList selectedTabId={tabIds[0]} aria-label={tabListLabel}>
						{tabIds.map((id, i) => (
							<Tab key={id} id={id}>
								{tabLabels[i]}
							</Tab>
						))}
					</TabList>
					{tabPanelContents.map((text) => (
						<TabPanel key={text}>{text}</TabPanel>
					))}
				</Tabs>,
			)

			const tab = screen.getByRole('tab', { name: tabLabels[0] })
			const tabPanel = screen.getByText(tabPanelContents[0])

			// Active Tab Assertions
			expect(tabPanel).toBeVisible()
			expect(tabPanel).toHaveAccessibleName(tab.textContent)
			expect(handleTabChange).toHaveBeenCalledTimes(1)

			rerender(
				<Tabs initialTab={0}>
					<TabList selectedTabId={tabIds[1]} aria-label={tabListLabel}>
						{tabIds.map((id, i) => (
							<Tab key={id} id={id}>
								{tabLabels[i]}
							</Tab>
						))}
					</TabList>
					{tabPanelContents.map((text) => (
						<TabPanel key={text}>{text}</TabPanel>
					))}
				</Tabs>,
			)

			const tab2 = screen.getByRole('tab', { name: tabLabels[1] })
			const tabPanel2 = screen.getByText(tabPanelContents[1])

			// Active Tab Assertions
			expect(tabPanel2).toBeVisible()
			expect(tabPanel2).toHaveAccessibleName(tab2.textContent)
			expect(handleTabChange).toHaveBeenCalledTimes(2)
		})

		it('Handles a tab label when an array is passed (not recommended)', () => {
			render(
				<Tabs initialTab={0}>
					<TabList aria-label={tabListLabel}>
						{tabIds.map((id, i) => (
							<Tab key={id} id={id}>
								{['Part 1', 'Part 2']}
							</Tab>
						))}
					</TabList>
					{tabPanelContents.map((text) => (
						<TabPanel key={text}>{text}</TabPanel>
					))}
				</Tabs>,
			)
			expect(screen.getAllByRole('tab', { name: 'Part 1Part 2', hidden: true })[0]).toBeInTheDocument()
		})
	})

	describe('Mouse Interactions', () => {
		it('Selects the `tab` that is clicked', async () => {
			renderComponentWithProps()

			// Verify `selected` tab info
			const firstTab = screen.getByRole('tab', { name: tabLabels[0], selected: true })
			const firstTabPanel = screen.getByRole('tabpanel', { name: tabLabels[0] })
			expect(firstTabPanel).toBeVisible()

			// Verify `unselected` tab info
			const secondTabPanel = screen.getByRole('tab', { name: tabLabels[1], selected: false })
			expect(screen.queryByRole('tabpanel', { name: tabLabels[1] })).not.toBeInTheDocument()

			// Select new tab and verify change
			await userEvent.click(secondTabPanel)
			expect(secondTabPanel).toHaveAttribute('aria-selected', String(true))
			expect(screen.getByRole('tabpanel', { name: tabLabels[1] })).toBeVisible()

			expect(firstTab).toHaveAttribute('aria-selected', String(false))
			expect(firstTabPanel).not.toBeVisible()
		})
	})

	describe('Keyboard Interactions', () => {
		it("Focuses the 'active' `tab` when the component is tabbed to", async () => {
			renderComponentWithProps()
			const selectedTab = screen.getByRole('tab', { selected: true })

			await userEvent.tab()
			expect(selectedTab).toHaveFocus()
		})

		/*
		 * Note: Usually, this causes a focusable element WITHIN the active `tabpanel` to receive focus
		 * (which is good, and WILL be tested). If the active `tab` is _next_ in the keyboard
		 * tab sequence, then that will be focused instead (neutral, and will NOT be tested).
		 */
		it("Prevents 'inactive' `tab`s from being tabbed to", async () => {
			const testText = 'Focusable Element'
			render(
				<Tabs>
					<TabList aria-label={tabListLabel}>
						<Tab id={tabIds[0]}>{tabLabels[0]}</Tab>
						<Tab id={tabIds[1]}>{tabLabels[1]}</Tab>
					</TabList>

					<TabPanel>
						<button type="button">{testText}</button>
					</TabPanel>
					<TabPanel>{tabPanelContents[1]}</TabPanel>
				</Tabs>,
			)

			// Verify that the selected tab is focused first
			const selectedTab = screen.getByRole('tab', { selected: true })
			expect(selectedTab).toBe(screen.getAllByRole('tab')[0])
			await userEvent.tab()
			expect(selectedTab).toHaveFocus()

			// Focus the next available element, which should be inside the active `tabpanel` -- NOT the next `tab`
			await userEvent.tab()
			screen.getAllByRole('tab').forEach((tab) => expect(tab).not.toHaveFocus())

			const focusableElement = screen.getByText(testText)
			expect(focusableElement).toHaveFocus()
			expect(screen.getByRole('tabpanel', { name: tabLabels[0] })).toContainElement(focusableElement)
		})

		it('Moves focus to the NEXT `tab` when the `ArrowRight` key is pressed', async () => {
			renderComponentWithProps()

			// Verify that the selected tab (first tab) is focused first
			const firstTab = screen.getByRole('tab', { name: tabLabels[0], selected: true })
			await userEvent.tab()
			expect(firstTab).toHaveFocus()

			// Move focus forward for ALL of the tabs
			for (let i = 1; i < tabIds.length; i += 1) {
				// eslint-disable-next-line no-await-in-loop -- Simplest way to implement test
				await userEvent.keyboard('{ArrowRight}')
				expect(screen.getByRole('tab', { name: tabLabels[i - 1] })).not.toHaveFocus()
				expect(screen.getByRole('tab', { name: tabLabels[i] })).toHaveFocus()
				expect(firstTab).toHaveAttribute('aria-selected', String(true))
			}

			// Now that we're at the end, WRAP focus to the beginning by moving forward one more time
			await userEvent.keyboard('{ArrowRight}')
			expect(screen.getByRole('tab', { name: tabLabels.at(-1) })).not.toHaveFocus()
			expect(screen.getByRole('tab', { name: tabLabels[0] })).toHaveFocus()
			expect(firstTab).toHaveAttribute('aria-selected', String(true))
		})

		it('Moves focus to the PREVIOUS `tab` when the `ArrowLeft` key is pressed', async () => {
			const initialTab = tabIds.length - 1
			renderComponentWithProps({ initialTab })

			// Verify that the selected tab (last tab) is focused first
			const lastTab = screen.getByRole('tab', { name: tabLabels.at(-1), selected: true })
			await userEvent.tab()
			expect(lastTab).toHaveFocus()

			// Move focus backward for ALL of the tabs
			for (let i = initialTab - 1; i >= 0; i -= 1) {
				// eslint-disable-next-line no-await-in-loop -- Simplest way to implement test
				await userEvent.keyboard('{ArrowLeft}')
				expect(screen.getByRole('tab', { name: tabLabels[i + 1] })).not.toHaveFocus()
				expect(screen.getByRole('tab', { name: tabLabels[i] })).toHaveFocus()
				expect(lastTab).toHaveAttribute('aria-selected', String(true))
			}

			// Now that we're at the beginning, WRAP focus to the end by moving backward one more time
			await userEvent.keyboard('{ArrowLeft}')
			expect(screen.getByRole('tab', { name: tabLabels[0] })).not.toHaveFocus()
			expect(screen.getByRole('tab', { name: tabLabels.at(-1) })).toHaveFocus()
			expect(lastTab).toHaveAttribute('aria-selected', String(true))
		})

		it('Moves focus to the FIRST `tab` when the `Home` key is pressed', async () => {
			const initialTab = tabIds.length - 1
			renderComponentWithProps({ initialTab })

			// Verify that the selected tab (last tab) is focused first
			const lastTab = screen.getByRole('tab', { name: tabLabels.at(-1), selected: true })
			await userEvent.tab()
			expect(lastTab).toHaveFocus()

			// Move focus to the first tab
			await userEvent.keyboard('{Home}')
			expect(screen.getByRole('tab', { name: tabLabels[0] })).toHaveFocus()
			expect(lastTab).not.toHaveFocus()
			expect(lastTab).toHaveAttribute('aria-selected', String(true))
		})

		it('Moves focus to the LAST `tab` when the `End` key is pressed', async () => {
			const initialTab = 0
			renderComponentWithProps({ initialTab })

			// Verify that the selected tab (first tab) is focused first
			const firstTab = screen.getByRole('tab', { name: tabLabels[0], selected: true })
			await userEvent.tab()
			expect(firstTab).toHaveFocus()

			// Move focus to the first tab
			await userEvent.keyboard('{End}')
			expect(screen.getByRole('tab', { name: tabLabels.at(-1) })).toHaveFocus()
			expect(firstTab).not.toHaveFocus()
			expect(firstTab).toHaveAttribute('aria-selected', String(true))
		})

		it('Selects the currently-focused tab when the `Enter` key or the `SpaceBar` key is presssed', async () => {
			renderComponentWithProps()

			// Verify starting conditions
			const firstTab = screen.getByRole('tab', { name: tabLabels[0], selected: true })
			const firstTabPanel = screen.getByRole('tabpanel', { name: tabLabels[0] })
			expect(firstTabPanel).toBeVisible()

			await userEvent.tab()
			expect(firstTab).toHaveFocus()

			// Select second tab with the `Enter` key
			await userEvent.keyboard('{ArrowRight}{Enter}')
			const secondTab = screen.getByRole('tab', { name: tabLabels[1], selected: true })
			const secondTabPanel = screen.getByRole('tabpanel', { name: tabLabels[1] })
			expect(secondTabPanel).toBeVisible()

			expect(firstTab).toHaveAttribute('aria-selected', String(false))
			expect(firstTabPanel).not.toBeVisible()

			// Select third tab with the `SpaceBar` key
			await userEvent.keyboard('{ArrowRight} ')
			expect(screen.getByRole('tab', { name: tabLabels[2], selected: true })).toBeInTheDocument()
			expect(screen.getByRole('tabpanel', { name: tabLabels[2] })).toBeVisible()

			expect(firstTab).toHaveAttribute('aria-selected', String(false))
			expect(firstTabPanel).not.toBeVisible()
			expect(secondTab).toHaveAttribute('aria-selected', String(false))
			expect(secondTabPanel).not.toBeVisible()
		})
	})

	/*
	 * NOTE: Check with MDN and WAI-ARIA to verify that we're following the proper standards.
	 * Prefer WAI-ARIA over MDN if there's a conflict (there shouldn't be).
	 */
	describe('Miscellaneous Accessibility (A11y) Requirements', () => {
		it('Sets up the appropriate relationships between the various elements', () => {
			const initialTab = 0
			renderComponentWithProps({ initialTab })
			const tabList = screen.getByRole('tablist', { name: tabListLabel })

			tabLabels.forEach((_, i) => {
				const tab = screen.getByRole('tab', { name: tabLabels[i] })
				const tabPanel = screen.getByText(tabPanelContents[i])

				expect(tabList).toContainElement(tab)
				expect(tab).toHaveAttribute('aria-controls', tabPanel.getAttribute('id'))
				expect(tabPanel).toHaveAttribute('aria-labelledby', tab.getAttribute('id'))
				expect(tabPanel).toHaveAttribute('role', 'tabpanel')

				/* eslint-disable jest/no-conditional-expect -- Simplifies Looped Assertions */

				// Active Tab Assertions
				if (tab.getAttribute('aria-selected') === String(true)) {
					expect(tabPanel).toBeVisible()
					expect(tabPanel).toHaveAccessibleName(tab.textContent)
				}
				// Inactive Tab Assertions
				else {
					expect(tabPanel).not.toBeVisible()
					expect(tabPanel).not.toHaveAccessibleName()
				}

				/* eslint-enable jest/no-conditional-expect */
			})
		})
	})
})
