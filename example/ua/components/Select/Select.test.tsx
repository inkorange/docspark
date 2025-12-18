/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "expect*"] }] */
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Select, Option } from './Select'

/* -------------------- Type Definitions -------------------- */
type TestProps = Omit<React.ComponentProps<typeof Select>, 'children'>

interface OptionObject {
	/** The option's label. */
	label: string

	/** The option's value. Defaults to the option's `label` if no value is provided */
	value?: string
	disabled?: boolean
}

describe('Select (Component)', () => {
	const selectId = 'my-select'
	const testOpts = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eight', 'Ninth', 'Tenth']

	/* -------------------- Helper Function -------------------- */
	function getRandomOption<T extends string[]>(options: T = testOpts as T): T[number] {
		const optionIndex = Math.floor(Math.random() * options.length)
		return options[optionIndex]
	}

	function renderComponent({ id = selectId, ...rest }: TestProps = { id: selectId }) {
		return render(
			<Select id={id} {...rest}>
				{testOpts.map((o) => (
					<Option key={o}>{o}</Option>
				))}
			</Select>,
		)
	}

	/* -------------------- Local Assertion Utilities -------------------- */
	function expectListboxToBeClosed() {
		expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', String(false))
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
		screen.queryAllByRole('option').forEach((o) => expect(o).not.toBeInTheDocument())
		testOpts.forEach((o) => expect(screen.queryByRole('option', { name: o })).not.toBeInTheDocument())
	}

	function expectAllOptionsToBeVisible(options: string[]) {
		expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', String(true))
		expect(screen.getByRole('listbox')).toBeVisible()
		screen.getAllByRole('option').forEach((o) => expect(o).toBeVisible())
		options.forEach((o) => expect(screen.getByRole('option', { name: o })).toBeVisible())
	}

	function expectOptionToBeSelected({ label, value }: OptionObject, selected = true) {
		// Verify that `combobox` has correct values
		const button = screen.getByRole('combobox') as HTMLButtonElement
		const effectiveValue = typeof value !== 'undefined' ? value : label
		const selector = "[role='option']" // Selector for an accessible "option"

		if (selected) {
			expect(button).toHaveTextContent(label)
			expect(button).toHaveValue(effectiveValue)
			expect(screen.getByText(label, { selector })).toHaveAttribute('aria-selected', String(true))
		} else {
			expect(button).not.toHaveTextContent(label)
			expect(button).not.toHaveValue(effectiveValue)
			expect(screen.getByText(label, { selector })).toHaveAttribute('aria-selected', String(false))
		}

		// Verify that `option` has correct attributes WITHOUT disrupting other tests
		const optionEl = screen.getByText(label, { selector: "[role='option']" })
		if (selected) {
			expect(optionEl).toHaveAttribute('aria-selected', String(true))
		} else {
			expect(optionEl).toHaveAttribute('aria-selected', String(false))
		}
	}

	function expectOptionToBeActive({ label }: OptionObject, active = true) {
		// Active options should be visible
		const optionEl = screen.getByRole('option', { name: label })
		const button = screen.getByRole('combobox')

		// Active
		if (active) {
			expect(button).toHaveAttribute('aria-activedescendant', optionEl.id)
			expect(optionEl).toHaveAttribute('data-active', String(true))
		}
		// Inactive
		else {
			expect(button).not.toHaveAttribute('aria-activedescendant', optionEl.id)
			expect(optionEl).not.toHaveAttribute('data-active')
		}
	}

	/* -------------------- Tests -------------------- */
	describe('Mouse Interactions', () => {
		it('Toggles the options display when clicked', async () => {
			renderComponent()

			// No options should be present initially
			expectListboxToBeClosed()

			// Open with first click
			await userEvent.click(screen.getByRole('combobox'))
			expectAllOptionsToBeVisible(testOpts)

			// Close with second click
			await userEvent.click(screen.getByRole('combobox'))
			expectListboxToBeClosed()
		})

		it('Hides the options when the user clicks outside the component', async () => {
			renderComponent()

			// No options should be present initially
			expectListboxToBeClosed()

			// Open with click
			await userEvent.click(screen.getByRole('combobox'))
			expectAllOptionsToBeVisible(testOpts)

			// Close with outside click
			await userEvent.click(document.body)
			expectListboxToBeClosed()
		})

		it('Sets the most recently hovered option as `active`', async () => {
			renderComponent()

			const button = screen.getByRole('combobox') as HTMLButtonElement
			await userEvent.click(button)
			expectAllOptionsToBeVisible(testOpts)

			const firstOption = testOpts[0]
			const firstOptionEl = screen.getByRole('option', { name: firstOption, selected: true })
			expect(button).toHaveAttribute('aria-activedescendant', firstOptionEl.id)

			// Hover Second Option
			const secondOption = testOpts[1]
			const secondOptionEl = screen.getByRole('option', { name: secondOption })
			await userEvent.hover(secondOptionEl)
			expectOptionToBeActive({ label: secondOption })
			expectOptionToBeActive({ label: firstOption }, false)

			// Hover Third Option
			const thirdOption = testOpts[2]
			const thirdOptionEl = screen.getByRole('option', { name: thirdOption })
			await userEvent.hover(thirdOptionEl)
			expectOptionToBeActive({ label: thirdOption })
			expectOptionToBeActive({ label: secondOption }, false)
		})

		it('Selects the option the user clicks, closing the `listbox`', async () => {
			renderComponent()
			await userEvent.click(screen.getByRole('combobox'))

			const option = getRandomOption(testOpts.slice(1))
			const optionEl = screen.getByRole('option', { name: option, selected: false })
			await userEvent.click(optionEl)

			expectOptionToBeSelected({ label: option })
			expectListboxToBeClosed()
		})

		it('DOES NOT select a `disabled` option when a user clicks it', async () => {
			const disabledOption = getRandomOption(testOpts.slice(1))

			render(
				<Select id={selectId}>
					{testOpts.map((o) => (
						<Option key={o} disabled={o === disabledOption}>
							{o}
						</Option>
					))}
				</Select>,
			)

			await userEvent.click(screen.getByRole('combobox'))
			await userEvent.click(screen.getByRole('option', { name: disabledOption }))
			expectOptionToBeSelected({ label: disabledOption }, false)
		})
	})

	describe('Keyboard Interactions', () => {
		it("Opens the `listbox` when 'clicked' with the `SpaceBar` key", async () => {
			renderComponent()

			// No options should be present initially
			expectListboxToBeClosed()

			// Open with `SpaceBar` key ("click")
			await userEvent.tab()
			await userEvent.keyboard('{ }')
			expectAllOptionsToBeVisible(testOpts)
		})

		it("DOES NOT open the `listbox` when 'clicked' with the `Enter` key", async () => {
			renderComponent()

			// No options should be present initially
			expectListboxToBeClosed()

			// "Click" with `Enter` key
			await userEvent.tab()
			await userEvent.keyboard('{Enter}')
			expectListboxToBeClosed()
		})

		it('Closes the `listbox` when the `Escape` key is pressed', async () => {
			renderComponent()

			// Open listbox by "clicking" it
			await userEvent.keyboard('{Tab}{ }')
			expectAllOptionsToBeVisible(testOpts)

			// Close the `listbox` by pressing `Escape`
			await userEvent.keyboard('{Escape}')
			expectListboxToBeClosed()
			expect(screen.getByRole('combobox')).toHaveFocus()
		})

		it('Navigates the options using the `ArrowUp`/`ArrowDown` keys', async () => {
			renderComponent()

			// Navigate _all the way down_ the list of options
			await userEvent.keyboard(`{Tab}{ }{ArrowDown>${testOpts.length - 1}}/`)
			const lastOption = testOpts.at(-1) as string
			expectOptionToBeActive({ label: lastOption })

			// Navigate to the previous option
			await userEvent.keyboard('{ArrowUp}')
			const secondToLastOption = testOpts.at(-2) as string
			expectOptionToBeActive({ label: secondToLastOption })
			expectOptionToBeActive({ label: lastOption }, false)
		})

		it('Opens the `listbox` without performing navigation when `ArrowUp`/`ArrowDown` is pressed', async () => {
			// Put initial value in the middle to prevent false positives
			const initialValue = testOpts[Math.floor(testOpts.length / 2)]
			renderComponent({ id: selectId, value: initialValue })
			expectListboxToBeClosed()
			expectOptionToBeSelected({ label: initialValue })

			// Open `listbox` with `ArrowDown` key
			await userEvent.keyboard('{Tab}{ArrowDown}')
			expectAllOptionsToBeVisible(testOpts)
			expectOptionToBeActive({ label: initialValue })

			// Close the `listbox`
			await userEvent.keyboard('{Escape}')
			expectListboxToBeClosed()

			// Open `listbox` again, but with `ArrowUp` key
			await userEvent.keyboard('{ArrowUp}')
			expectAllOptionsToBeVisible(testOpts)
			expectOptionToBeActive({ label: initialValue })
		})

		it('Does not navigate past the last option when `ArrowDown` is pressed', async () => {
			const lastOption = testOpts.at(-1) as string
			renderComponent()

			// Open `listbox` and try to navigate _down_ BEYOND the number of options
			await userEvent.keyboard(`{Tab}{ }{ArrowDown>${(testOpts.length - 1) * 2}/}`)
			expectOptionToBeActive({ label: lastOption })
		})

		it('Does not navigate past the first option when `ArrowUp` is pressed', async () => {
			const firstOption = testOpts[0]
			renderComponent()

			// Open `listbox` and try to navigate _up_ BEYOND the number of options
			await userEvent.keyboard(`{Tab}{ }{ArrowUp>${(testOpts.length - 1) * 2}/}`)
			expectOptionToBeActive({ label: firstOption })
		})

		it('Moves to the first option when the `Home` key is pressed', async () => {
			// Put initial value at the end to avoid false positives
			const initialValue = testOpts.at(-1) as string
			renderComponent({ id: selectId, value: initialValue })

			// Open `listbox`
			await userEvent.keyboard('{Tab}{ }')
			expectOptionToBeActive({ label: initialValue })

			// Use `Home` key to move to first option
			const firstOption = testOpts[0]
			await userEvent.keyboard('{Home}')
			expectAllOptionsToBeVisible(testOpts)
			expectOptionToBeActive({ label: firstOption })
		})

		it('Opens the `listbox` without moving to the first option  when `Home` is pressed', async () => {
			// Put initial value at the end to avoid false positives
			const lastOption = testOpts.at(-1) as string
			renderComponent({ id: selectId, value: lastOption })
			expectListboxToBeClosed()
			expectOptionToBeSelected({ label: lastOption })

			// Open `listbox` with `Home` key
			await userEvent.keyboard('{Tab}{Home}')
			expectAllOptionsToBeVisible(testOpts)
			expectOptionToBeActive({ label: lastOption })
		})

		it('Moves to the last option when the `End` key is pressed', async () => {
			// Verify initial value is at the beginning to avoid false positives
			const firstOption = testOpts[0]
			renderComponent()
			expectOptionToBeSelected({ label: firstOption })

			// Open `listbox`
			await userEvent.keyboard('{Tab}{ }')
			expectOptionToBeActive({ label: firstOption })

			// Use `End` key to move to last option
			const lastOption = testOpts.at(-1) as string
			await userEvent.keyboard('{End}')
			expectAllOptionsToBeVisible(testOpts)
			expectOptionToBeActive({ label: lastOption })
		})

		it('Opens the `listbox` without moving to the last option  when `End` is pressed', async () => {
			// Verify initial value is at the beginning to avoid false positives
			const firstOption = testOpts[0]
			renderComponent()
			expectListboxToBeClosed()
			expectOptionToBeSelected({ label: firstOption })

			// Open `listbox` with `End` key
			await userEvent.keyboard('{Tab}{End}')
			expectAllOptionsToBeVisible(testOpts)
			expectOptionToBeActive({ label: firstOption })
		})

		it('Navigates to the next option starting with the searched character', async () => {
			renderComponent()
			const wordsStartingWithS = testOpts.filter((o) => o.charAt(0).toLowerCase() === 's')
			expect(wordsStartingWithS.length).toBeGreaterThan(1)

			// Verify initial conditions
			await userEvent.keyboard('{Tab}{ }')
			wordsStartingWithS.forEach((o) => expectOptionToBeActive({ label: o }, false))

			// Continuously search for first letter
			for (const word of wordsStartingWithS) {
				await userEvent.keyboard(`${word.charAt(0)}`)
				expectOptionToBeActive({ label: word })
			}

			// Now that all options are exhausted, loop back to first matching option again
			await userEvent.keyboard(wordsStartingWithS[0].charAt(0).toLowerCase()) // Verify case-insensitivity
			expectOptionToBeActive({ label: wordsStartingWithS[0] })
		})

		it('Navigates to the next option starting with the rapidly typed search string (threshold: 0.5s)', async () => {
			/** The amount of time (in `milliseconds`) after which the `Select` search string is emptied */
			const searchThreshold = 500
			/** Multiplier to PREVENT the `searchThreshold` from being exceeded (lightly conservative) */
			const fastFraction = 0.85
			renderComponent()

			/* ---------- Setup + Verify Initial Conditions ---------- */
			// Constants
			const tenthText = testOpts.at(-1) as 'Tenth'
			expect(tenthText).toBe('Tenth')
			const ninthText = testOpts[8] as 'Ninth'
			expect(ninthText).toBe('Ninth')
			const searchString = 'Ten'

			// "search" is a SUBSET of "Tenth" option
			expect(tenthText).toMatch(searchString)
			expect(tenthText).not.toBe(searchString)

			// LAST letter in "search" could cause a different option ("Ninth") to be selected if typed too slowly
			expect(searchString.at(-1)).toBe(ninthText[0].toLowerCase())

			// Neither "Tenth" nor "Ninth" are active
			await userEvent.keyboard('{Tab}{ }')
			expectOptionToBeActive({ label: tenthText }, false)
			expectOptionToBeActive({ label: ninthText }, false)

			/* ---------- Execute Test ---------- */
			await userEvent.keyboard(searchString, { delay: searchThreshold * fastFraction })
			expectOptionToBeActive({ label: tenthText })
		})

		it('Navigates to the next option starting with the slowly typed search character (threshold: 0.5s)', async () => {
			/** The amount of time (in `milliseconds`) after which the `Select` search string is emptied */
			const searchThreshold = 500
			/** Multiplier to FORCE the `searchThreshold` to be exceeded (lightly conservative) */
			const slowFraction = 1.15
			renderComponent()

			/* ---------- Setup + Verify Initial Conditions ---------- */
			// Constants
			const tenthText = testOpts.at(-1) as 'Tenth'
			expect(tenthText).toBe('Tenth')
			const ninthText = testOpts[8] as 'Ninth'
			expect(ninthText).toBe('Ninth')
			const searchString = 'Ten'

			// "search" is a SUBSET of "Tenth" option
			expect(tenthText).toMatch(searchString)
			expect(tenthText).not.toBe(searchString)

			// LAST letter in "search" could cause a different option to be selected if typed too slowly
			expect(searchString.at(-1)).toBe(ninthText[0].toLowerCase())

			// Neither "Tenth" nor "Ninth" are active
			await userEvent.keyboard('{Tab}{ }')
			expectOptionToBeActive({ label: tenthText }, false)
			expectOptionToBeActive({ label: ninthText }, false)

			/* ---------- Execute Test ---------- */
			await userEvent.keyboard(searchString, { delay: searchThreshold * slowFraction })
			expectOptionToBeActive({ label: ninthText })
		})

		it("Resets the search string when it doesn't match any of the options", async () => {
			renderComponent()

			/* ---------- Setup + Verify Initial Conditions ---------- */
			// Constants
			const fourthText = testOpts[3] as 'Fourth'
			expect(fourthText).toBe('Fourth')
			const fifthText = testOpts[4] as 'Fifth'
			expect(fifthText).toBe('Fifth')

			// Test words are not `active`
			await userEvent.keyboard('{Tab}{ }')
			expectOptionToBeActive({ label: testOpts[0] as 'First' })
			expectOptionToBeActive({ label: fourthText }, false)
			expectOptionToBeActive({ label: fifthText }, false)

			/* ---------- Execute Test ---------- */
			// Originally, `Fourth` matches first letter (`Fourth`)
			await userEvent.keyboard(fourthText[0])
			expectOptionToBeActive({ label: fourthText })

			// Now search (`Fo`) matches `Fourth` because we typed lightening fast
			await userEvent.keyboard(fourthText[1])
			expectOptionToBeActive({ label: fourthText })

			// Nothing changes because we typed an invalid character (search is now `""`)
			await userEvent.keyboard('z')
			expectOptionToBeActive({ label: fourthText })

			// Search is reset (to `F`), causing `Fifth` to be matched
			await userEvent.keyboard(fourthText[0])
			expectOptionToBeActive({ label: fifthText })
		})

		it('Opens the `listbox` without performing a search when a printable character is pressed', async () => {
			renderComponent()
			const [firstOption, secondOption] = testOpts
			expect(firstOption[0].toLowerCase()).not.toBe(secondOption[0].toLowerCase())

			await userEvent.keyboard(`{Tab}${secondOption[0]}`)
			expectAllOptionsToBeVisible(testOpts)
			expectOptionToBeActive({ label: firstOption })
		})

		it('Selects the `active` option when the user presses `SpaceBar`, closing the `listbox`', async () => {
			renderComponent()
			const option = getRandomOption()

			// Open `listbox`, search for `option`, and press `SpaceBar`
			await userEvent.keyboard(`{Tab}{ }`)
			await userEvent.keyboard(option)
			await userEvent.keyboard('{ }')

			expectOptionToBeSelected({ label: option })
			expectListboxToBeClosed()
			expect(screen.getByRole('combobox')).toHaveFocus()
		})

		it('Selects the `active` option when the user presses `Enter`, closing the `listbox`', async () => {
			renderComponent()
			const option = getRandomOption()

			// Open `listbox`, search for `option`, and press `Enter`
			await userEvent.keyboard(`{Tab}{ }`)
			await userEvent.keyboard(option)
			await userEvent.keyboard('{Enter}')

			expectOptionToBeSelected({ label: option })
			expectListboxToBeClosed()
			expect(screen.getByRole('combobox')).toHaveFocus()
		})

		it('Selects the `active` option when the user `Tab`s, closing the `listbox` and shifting focus', async () => {
			renderComponent()
			const option = getRandomOption()

			// Open `listbox`, search for `option`, and press `Tab`
			await userEvent.keyboard(`{Tab}{ }`)
			await userEvent.keyboard(option)
			await userEvent.keyboard('{Tab}')

			expectOptionToBeSelected({ label: option })
			expectListboxToBeClosed()
			expect(screen.getByRole('combobox')).not.toHaveFocus()
		})

		it('DOES NOT select a `disabled` option in response to ANY keyboard events, even if it is `active`', async () => {
			const disabledOption = getRandomOption(testOpts.slice(1))

			render(
				<Select id={selectId}>
					{testOpts.map((o) => (
						<Option key={o} disabled={o === disabledOption}>
							{o}
						</Option>
					))}
				</Select>,
			)

			// Open `listbox` and search for disabled `option`
			await userEvent.keyboard(`{Tab}{ }`)
			await userEvent.keyboard(disabledOption)
			const combobox = screen.getByRole('combobox')

			// Attempt ALL submission keys (`SpaceBar`, `Enter`, `Tab`)
			expect(combobox).toHaveFocus()
			await userEvent.keyboard('{ }')
			expectOptionToBeSelected({ label: disabledOption }, false)
			expectAllOptionsToBeVisible(testOpts)

			expect(combobox).toHaveFocus()
			await userEvent.keyboard('{Enter}')
			expectOptionToBeSelected({ label: disabledOption }, false)
			expectAllOptionsToBeVisible(testOpts)

			expect(combobox).toHaveFocus()
			await userEvent.keyboard('{Tab}')
			expectOptionToBeSelected({ label: disabledOption }, false)
			expectAllOptionsToBeVisible(testOpts)
		})

		it('Moves keyboard focus as normal when the user `Tab`s away from a closed `combobox`', async () => {
			renderComponent()

			const combobox = screen.getByRole('combobox')
			expectListboxToBeClosed()

			await userEvent.tab()
			expect(combobox).toHaveFocus()
			expectListboxToBeClosed()

			await userEvent.tab()
			expect(combobox).not.toHaveFocus()
			expectListboxToBeClosed()
		})

		it('Allows `SubmitEvent`s caused by the `Enter` key to run when the `listbox` is closed', async () => {
			const mockSubmitHandler = jest.fn((event: React.FormEvent) => event.preventDefault())

			render(
				<form onSubmit={mockSubmitHandler}>
					<Select id={selectId}>
						{testOpts.map((o) => (
							<Option key={o}>{o}</Option>
						))}
					</Select>
				</form>,
			)

			// Focus `combobox`
			await userEvent.keyboard('{Tab}')

			// Run submitter once
			expectListboxToBeClosed()
			await userEvent.keyboard('{Enter}')
			expect(mockSubmitHandler).toHaveBeenCalledTimes(1)

			// Select an option, and see that submitter was NOT run
			await userEvent.keyboard('{ArrowDown>2/}{Enter}')
			expectOptionToBeSelected({ label: testOpts[1] })
			expect(mockSubmitHandler).toHaveBeenCalledTimes(1)

			// Now that the `listbox` is closed again, run submitter a second time
			expectListboxToBeClosed()
			await userEvent.keyboard('{Enter}')
			expect(mockSubmitHandler).toHaveBeenCalledTimes(2)
		})

		it("Includes its value in the owning `form`'s data", async () => {
			const formLabel = 'test-form'
			const fieldName = 'test-name'

			render(
				<form aria-label={formLabel}>
					<Select id={selectId} name={fieldName}>
						{testOpts.map((o) => (
							<Option key={o}>{o}</Option>
						))}
					</Select>
				</form>,
			)

			// Check form data with default values
			const form = screen.getByRole('form', { name: formLabel }) as HTMLFormElement
			const combobox = screen.getByRole('combobox') as HTMLButtonElement

			const initialFormData = Object.fromEntries(new FormData(form))
			expect(initialFormData[fieldName]).toBe(combobox.getAttribute('value'))

			// Select an option that is NOT the default value
			const lastOption = testOpts.at(-1) as string
			await userEvent.keyboard(`{Tab}{ }${lastOption}{Enter}`)
			expectOptionToBeSelected({ label: lastOption })

			expect(combobox.value).not.toBe(initialFormData[fieldName])
			expect(combobox.value).toBe(combobox.getAttribute('value'))
		})
	})

	describe('Miscellaneous Behaviors', () => {
		it('Automatically makes the currently selected option active when the `listbox` is opened', async () => {
			renderComponent()

			// Choose last option
			await userEvent.keyboard('{Tab}{ }{End}{Enter}')
			const lastOption = testOpts.at(-1) as string
			expectOptionToBeSelected({ label: lastOption })
			expectListboxToBeClosed()

			// Open `listbox` and verify `active` option
			await userEvent.keyboard('{ }')
			expectAllOptionsToBeVisible(testOpts)
			expectOptionToBeActive({ label: lastOption })
		})

		it('Synchronizes its `value` with a hidden `input` to support form submission', async () => {
			const testName = 'my-field-name'
			render(
				<Select id={selectId} name={testName}>
					{testOpts.map((o) => (
						<Option key={o}>{o}</Option>
					))}
				</Select>,
			)

			// eslint-disable-next-line testing-library/no-node-access -- No other (clean) way to access `hidden` inputs
			const hiddenInput = document.querySelector(`input[name=${testName}][aria-hidden=true]`)

			const combobox = screen.getByRole('combobox') as HTMLButtonElement
			expect(combobox).toHaveAttribute('name', `${testName}-combobox`)

			// The values are initially synchronized
			expectOptionToBeSelected({ label: testOpts[0] })
			expect(hiddenInput).toHaveValue(testOpts[0])

			// The values remain synchronized after updates
			const newOption = getRandomOption(testOpts.slice(1))
			await userEvent.keyboard(`{Tab}{ }${newOption}{Enter}`)

			expectOptionToBeSelected({ label: newOption })

			// eslint-disable-next-line testing-library/no-node-access
			const updatedValue = document.querySelector(`input[name=${testName}][aria-hidden=true]`)
			expect(updatedValue).toHaveAttribute('value', newOption)

			// The values remain synchronized after forced erasures
			combobox.removeAttribute('value')
			await waitFor(() => expect(hiddenInput).not.toHaveAttribute('value')) // Must wait for `MutationObserver`s
		})
	})

	describe('Options (Component) Support', () => {
		it("Distinguishes between an option's `label` and `value` if both are provided", () => {
			const optionLabel = testOpts[0]
			const optionValue = '0'
			expect(optionLabel).not.toBe(optionValue)

			render(
				<Select id={selectId} value={optionValue}>
					<Option value={optionValue}>{optionLabel}</Option>
				</Select>,
			)

			const combobox = screen.getByRole('combobox') as HTMLButtonElement
			expectOptionToBeSelected({ label: optionLabel, value: optionValue })

			// Intentionally redundant
			expect(combobox).toHaveTextContent(optionLabel)
			expect(combobox).toHaveValue(optionValue)
		})

		it("Substitues an option's `label` for its `value` if none is provided", () => {
			const option = testOpts[0]

			render(
				<Select id={selectId} value={option}>
					<Option>{option}</Option>
				</Select>,
			)

			const combobox = screen.getByRole('combobox') as HTMLButtonElement
			expectOptionToBeSelected({ label: option })

			// Intentionally redundant
			expect(combobox).toHaveValue(option)
			expect(combobox).toHaveValue(option)
		})
	})

	describe('API', () => {
		it('Defaults its own value to the first option', () => {
			renderComponent()
			expectOptionToBeSelected({ label: testOpts[0] })
		})

		it('Accepts a default value if it is valid', () => {
			const option = getRandomOption(testOpts.slice(1))
			renderComponent({ id: selectId, value: option })
			expectOptionToBeSelected({ label: option })
		})

		it('Replaces an invalid `value` prop with an empty value (empty string)', () => {
			renderComponent({ id: selectId, value: 'invalid' })
			expect(screen.getByRole('combobox')).toHaveValue('')
			expect(screen.getByRole('combobox')).toHaveTextContent('')
		})

		it('Responds to updates to the `value` prop', async () => {
			const option = testOpts[0]
			const uiWithValue = (testValue?: string) => (
				<Select id={selectId} value={testValue}>
					<Option>{option}</Option>
				</Select>
			)

			// First Render -- No `value` supplied
			const { rerender } = render(uiWithValue())
			expectOptionToBeSelected({ label: option })

			// Re-render -- `value` supplied
			rerender(uiWithValue(option))
			expectOptionToBeSelected({ label: option })

			// 2nd Re-render -- INVALID `value` supplied
			rerender(uiWithValue('invalid-value'))
			await waitFor(() => expect(screen.getByRole('combobox')).toHaveValue('')) // Must wait for `MutationObserver`s
			expect(screen.getByRole('combobox')).toHaveTextContent('')
		})

		it('Calls `onInput` and `onChange` when an option is selected (`select` element parity)', async () => {
			const mockHandleInput = jest.fn()
			const mockHandleChange = jest.fn()
			renderComponent({ id: selectId, onInput: mockHandleInput, onChange: mockHandleChange })

			const combobox = screen.getByRole('combobox') as HTMLButtonElement
			const option = getRandomOption(testOpts.slice(1))
			await userEvent.click(combobox)
			await userEvent.click(screen.getByRole('option', { name: option }))

			expect(mockHandleInput).toHaveBeenCalledTimes(1)
			expect(mockHandleInput).toHaveBeenCalledWith(expect.any(InputEvent))

			expect(mockHandleChange).toHaveBeenCalledTimes(1)
			expect(mockHandleChange).toHaveBeenCalledWith(expect.any(Event))
		})

		it('Dispatches TRUE `input` and `change` events when an option is selected (`select` element parity)', async () => {
			render(
				<form aria-label="Test Form">
					<Select id={selectId}>
						{testOpts.map((o) => (
							<Option key={o}>{o}</Option>
						))}
					</Select>
				</form>,
			)

			// Setup
			const form = screen.getByRole('form') as HTMLFormElement
			const delegatedMockHandleInput = jest.fn()
			form.addEventListener('input', delegatedMockHandleInput)

			const delegatedMockHandleChange = jest.fn()
			form.addEventListener('change', delegatedMockHandleChange)

			// Select a new option
			const combobox = screen.getByRole('combobox')
			const option = getRandomOption(testOpts.slice(1))
			await userEvent.click(combobox)
			await userEvent.click(screen.getByRole('option', { name: option }))

			// Verify that the `input` and `change` events TRIGGER and BUBBLE
			expect(delegatedMockHandleInput).toHaveBeenCalledTimes(1)
			expect(delegatedMockHandleInput).toHaveBeenCalledWith(expect.any(InputEvent))
			expect(delegatedMockHandleInput).toHaveBeenCalledWith(expect.objectContaining({ target: combobox }))

			expect(delegatedMockHandleChange).toHaveBeenCalledTimes(1)
			expect(delegatedMockHandleChange).toHaveBeenCalledWith(expect.any(Event))
			expect(delegatedMockHandleChange).toHaveBeenCalledWith(expect.objectContaining({ target: combobox }))
		})

		it("DOESN'T dispatch `input`/`change` events when an option is RE-selected (`select` element parity)", async () => {
			const mockHandleInput = jest.fn()
			const mockHandleChange = jest.fn()

			render(
				<form aria-label="Test Form">
					<Select id={selectId} onInput={mockHandleInput} onChange={mockHandleChange}>
						{testOpts.map((o) => (
							<Option key={o}>{o}</Option>
						))}
					</Select>
				</form>,
			)

			// Additional Setup
			const form = screen.getByRole('form')
			const delegatedMockHandleInput = jest.fn()
			form.addEventListener('input', delegatedMockHandleInput)

			const delegatedMockHandleChange = jest.fn()
			form.addEventListener('change', delegatedMockHandleChange)

			// Select the SAME new option MULTIPLE TIMES
			const combobox = screen.getByRole('combobox')
			const option = getRandomOption(testOpts.slice(1))

			for (let i = 0; i < 3; i += 1) {
				await userEvent.click(combobox)
				await userEvent.click(screen.getByRole('option', { name: option }))
			}

			// No handlers should have been called more than once
			expect(mockHandleInput).toHaveBeenCalledTimes(1)
			expect(delegatedMockHandleInput).toHaveBeenCalledTimes(1)

			expect(mockHandleChange).toHaveBeenCalledTimes(1)
			expect(delegatedMockHandleChange).toHaveBeenCalledTimes(1)
		})

		it("Does not render children that aren't `Option` components", async () => {
			const testOption = testOpts[0]
			const testText = 'My Text'

			render(
				<Select id={selectId}>
					<Option>{testOption}</Option>
					<li role="option" aria-selected={false}>
						{testText}
					</li>
				</Select>,
			)

			// Expand `listbox`
			await userEvent.keyboard('{Tab}{ }')
			expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', String(true))
			expect(screen.getByRole('listbox')).toBeVisible()
			screen.getAllByRole('option').forEach((o) => expect(o).toBeVisible())
			expect(screen.getByRole('option', { name: testOption })).toBeVisible()

			// Verify that the invalid element is not present; doubly verify this with `*ByText` instead of `*ByRole`
			expect(screen.queryByText(testText)).not.toBeInTheDocument()
		})

		it('Recursively renders `options` (1 level deep ONLY)', async () => {
			const startOption = 'He must increase'
			const endOption = 'I must decrease'
			const getNestedText = (number: number) => `Nested: ${number}`

			render(
				<Select id={selectId}>
					<Option>{startOption}</Option>
					{[1, 2, 3].map((number) => (
						<Option key={number}>{getNestedText(number)}</Option>
					))}

					<Option>{endOption}</Option>
				</Select>,
			)

			await userEvent.keyboard('{Tab}{ }')
			expect(screen.getByRole('combobox', { expanded: true })).toBeInTheDocument()

			// Options WITHOUT Nesting
			expect(screen.getByRole('option', { name: startOption })).toBeInTheDocument()
			expect(screen.getByRole('option', { name: endOption })).toBeInTheDocument()

			// Options ONE LEVEL Nested
			expect(screen.getByRole('option', { name: getNestedText(1) })).toBeInTheDocument()
			expect(screen.getByRole('option', { name: getNestedText(2) })).toBeInTheDocument()
			expect(screen.getByRole('option', { name: getNestedText(3) })).toBeInTheDocument()
		})

		// Note: This feature is supported to more closely match the `select` element's behavior
		it('Allows its `value` to be changed through DOM interaction', async () => {
			const option = getRandomOption(testOpts.slice(1))
			renderComponent()

			const combobox = screen.getByRole('combobox') as HTMLButtonElement
			expectOptionToBeSelected({ label: testOpts[0] })

			combobox.value = option
			// Note: We must wait for asynchronous actions from `MutationObserver`s to complete
			await waitFor(() => expectOptionToBeSelected({ label: option }))
		})

		// Note: This feature is supported to more closely match the `select` element's behavior
		it('Rejects invalid `value`s imposed on it by DOM interactions', async () => {
			const invalidOption = 'Gokakyu no jutsu'
			expect(testOpts).not.toContain(invalidOption)
			renderComponent()

			const combobox = screen.getByRole('combobox') as HTMLButtonElement
			await userEvent.click(combobox)
			expectOptionToBeSelected({ label: testOpts[0] })

			combobox.value = invalidOption
			// Note: We must wait for asynchronous actions from `MutationObserver`s to complete
			await waitFor(() => expect(combobox).toHaveValue(''))
			expect(combobox).toHaveTextContent('')
			testOpts.forEach((o) => expectOptionToBeSelected({ label: o }, false))
		})

		describe('API Safeguards', () => {
			it("Does not allow an option's `value` to be `undefined`", async () => {
				const labels = { bad: 'bad', forcedBad: 'forcedBad' } as const
				render(
					<Select id={selectId}>
						<Option>{labels.bad}</Option>
						<Option value={undefined}>{labels.forcedBad}</Option>
					</Select>,
				)

				await userEvent.keyboard('{Tab}{ }')
				expect(screen.getByRole('combobox', { expanded: true })).toBeInTheDocument()

				// Verify that option `value`s are properly corrected
				expect(screen.getByRole('option', { name: labels.bad })).toHaveAttribute('data-value', labels.bad)
				expect(screen.getByRole('option', { name: labels.forcedBad })).toHaveAttribute('data-value', labels.forcedBad)
			})

			it('Does not allow important option attributes to be overwritten', async () => {
				const defaultOptionLabel = 'Default Option'
				const rebelliousOptionLabel = 'This is a jank option'

				const attrs = {
					'aria-disabled': 'aria-disabled',
					'aria-selected': 'aria-selected',
					'data-label': 'data-label',
					'data-value': 'data-value',
				} as const

				const illegalAttrs = {
					[attrs['aria-disabled']]: true,
					[attrs['aria-selected']]: true,
					[attrs['data-label']]: 'fus',
					[attrs['data-value']]: 'ro dah',
				} as const satisfies Record<keyof typeof attrs, unknown>

				expect(rebelliousOptionLabel).not.toBe(illegalAttrs['data-label'])

				render(
					<Select id={selectId}>
						<Option>{defaultOptionLabel}</Option>
						<Option {...illegalAttrs}>{rebelliousOptionLabel}</Option>
					</Select>,
				)

				await userEvent.keyboard('{Tab}{ }')
				expect(screen.getByRole('combobox', { expanded: true })).toBeInTheDocument()

				// Verify that the necessary option attributes are not overwritten
				const rebelliousOption = screen.getByRole('option', { name: rebelliousOptionLabel })
				expect(rebelliousOption).not.toHaveAttribute(attrs['aria-disabled'], String(illegalAttrs['aria-disabled']))
				expect(rebelliousOption).not.toHaveAttribute(attrs['aria-disabled']) // Attribute shouldn't be present AT ALL

				expect(rebelliousOption).not.toHaveAttribute(attrs['aria-selected'], String(illegalAttrs['aria-selected']))
				expect(rebelliousOption).toHaveAttribute(attrs['aria-selected'], String(false))

				expect(rebelliousOption).not.toHaveAttribute(attrs['data-label'], illegalAttrs['data-label'])
				expect(rebelliousOption).toHaveAttribute(attrs['data-label'], rebelliousOptionLabel)

				expect(rebelliousOption).not.toHaveAttribute(attrs['data-value'], illegalAttrs['data-value'])
				expect(rebelliousOption).toHaveAttribute(attrs['data-value'], rebelliousOptionLabel) // (IMPLIED option value)
			})
		})
	})

	describe('Intentionally Prevented Error Cases', () => {
		it('Successfully opens without an `active` option if it has an invalid value', async () => {
			renderComponent({ id: selectId, value: 'Invalid: ZA WARUDO' })

			const combobox = screen.getByRole('combobox')
			expect(combobox).toHaveValue('')
			expect(combobox).toHaveTextContent('')

			await userEvent.keyboard('{Tab}{ }')
			expect(combobox).toHaveAttribute('aria-activedescendant', '')
			testOpts.forEach((o) => expectOptionToBeActive({ label: o }, false))
		})

		it('Makes the first option `active` with the `ArrowDown` key if no option is currently `active`', async () => {
			const firstOption = testOpts[0]
			renderComponent({ id: selectId, value: 'Invalid: ZA WARUDO' })

			await userEvent.keyboard('{Tab}{ }{ArrowDown}')
			expectOptionToBeActive({ label: firstOption }, true)
		})

		it('Makes the first option `active` with the `ArrowUp` key if no option is currently `active`', async () => {
			const firstOption = testOpts[0]
			renderComponent({ id: selectId, value: 'Invalid: ZA WARUDO' })

			await userEvent.keyboard('{Tab}{ }{ArrowUp}')
			expectOptionToBeActive({ label: firstOption }, true)
		})
	})

	describe('Miscellaneous Accessibility (A11y) Requirements', () => {
		it('Is compatible with `label` elements', () => {
			const testLabel = 'Test Label'
			const testId = 'test-select'

			render(
				<>
					<label htmlFor={testId}>{testLabel}</label>
					<Select id={testId}>
						<Option>My Option</Option>
					</Select>
				</>,
			)

			expect(screen.getByLabelText(testLabel)).toStrictEqual(screen.getByRole('combobox'))
		})

		it('Sets up the appropriate a11y relationships for a `combobox`', async () => {
			renderComponent()

			// Get Elements
			await userEvent.keyboard('{Tab}{ }')
			const combobox = screen.getByRole('combobox') as HTMLButtonElement
			const listbox = screen.getByRole('listbox') as HTMLUListElement
			expectAllOptionsToBeVisible(testOpts)

			// Assert that `combobox` has meaningful ID
			const componentId = combobox.id
			expect(componentId.length).toBeGreaterThan(1)

			// Assert that `combobox` has correct STATIC ARIA attributes
			expect(combobox).toHaveAttribute('aria-haspopup', 'listbox')

			// Assert proper relationship between `combobox` and `listbox`
			expect(combobox).toHaveAttribute('aria-controls', listbox.id)
			expect(listbox).toHaveAttribute('id', `${componentId}-listbox`)

			// Assert proper relationship between `combobox`, `listbox`, and `option`s
			await userEvent.keyboard('{Escape}')

			for (const option of testOpts) {
				await userEvent.keyboard('{ArrowDown}')
				const optionEl = screen.getByRole('option', { name: option })

				expect(listbox).toContainElement(optionEl)
				expect(combobox).toHaveAttribute('aria-activedescendant', optionEl.id)
				expect(optionEl).toHaveAttribute('id', `${componentId}-option-${option}`)
			}
		})

		it('Communicates which options are `disabled` to the accessibility tree', async () => {
			const three = 3 satisfies 3
			render(
				<Select id="id">
					{testOpts.map((o, i) => (
						<Option key={o} disabled={i < three}>
							{o}
						</Option>
					))}
				</Select>,
			)

			await userEvent.click(screen.getByRole('combobox'))

			const optionElements = screen.getAllByRole('option')
			expect(optionElements.length).toBeGreaterThan(three)
			optionElements.forEach((o, i) => expect(o).toHaveAttribute('aria-disabled', String(i < three)))
		})
	})
})
