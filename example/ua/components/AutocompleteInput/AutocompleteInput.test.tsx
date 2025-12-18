import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { useEffect, useRef } from 'react'
import { AutocompleteInput } from './AutocompleteInput'

const autocompleteResponseData = [
	{ label: '111 Pine Rd.', value: '111 Pine Rd.' },
	{ label: '111 Tree Rd.', value: '111 Tree Rd.' },
	{ label: '111 York Rd.', value: '111 York Rd.' },
	{ label: '111 Under Rd.', value: '111 Under Rd.' },
	{ label: '111 Armour Rd.', value: '111 Armour Rd.' },
]

const AutoCompleteWithState = ({ val, dataConnectorMock, handleAutocompleteSelectedMock }) => {
	const inputRef = useRef<HTMLInputElement>(null)
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.value = val ?? ''
		}
	}, [val])
	return (
		<div>
			<AutocompleteInput
				name="address1"
				id="address-address1"
				ref={inputRef}
				dataConnector={dataConnectorMock}
				onAutoCompleteSelected={handleAutocompleteSelectedMock}
				defaultValue={''}
				required
				label="Address"
			/>
		</div>
	)
}
describe('AutocompleteInput (Component)', () => {
	const handleAutocompleteSelectedMock = jest.fn()
	const dataConnectorMock = jest.fn().mockImplementation(() => autocompleteResponseData)

	beforeEach(() => jest.clearAllMocks())

	it('Renders Autocomplete menu upon typing', async () => {
		render(
			<AutocompleteInput
				name="address1"
				id="address-address1"
				dataConnector={dataConnectorMock}
				onAutoCompleteSelected={handleAutocompleteSelectedMock}
				defaultValue={''}
				required
				label="Address"
			/>,
		)

		const inputEl = screen.getByRole('textbox', { name: 'Address' })
		expect(inputEl).toHaveAttribute('required')
		expect(inputEl).toHaveValue('')
		expect(screen.getByRole('alert')).toBeInTheDocument()

		expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

		await userEvent.type(inputEl, '111')
		expect(inputEl).toHaveValue('111')
		expect(await screen.findByRole('listbox')).toBeInTheDocument()
		expect(screen.getAllByRole('option')).toHaveLength(5)
		expect(dataConnectorMock).toHaveBeenCalledTimes(1)
	})

	it('Correctly interacts with the autocomplete menu width keyboard', async () => {
		render(
			<AutocompleteInput
				name="address1"
				id="address-address1"
				dataConnector={dataConnectorMock}
				onAutoCompleteSelected={handleAutocompleteSelectedMock}
				defaultValue={''}
				required
				label="Address"
			/>,
		)
		const inputEl = screen.getByRole('textbox', { name: 'Address' })
		await userEvent.type(inputEl, '111')

		expect(await screen.findByRole('listbox')).toBeInTheDocument()
		const allOptions = screen.getAllByRole('option')
		expect(allOptions.length).toBeGreaterThan(0)

		// Keyboard arrow functions
		expect(allOptions[0]).toHaveAttribute('aria-selected', String(false))

		await userEvent.keyboard('{ArrowDown}')
		expect(allOptions[0]).toHaveAttribute('aria-selected', String(true))

		await userEvent.keyboard('{ArrowDown}')
		expect(allOptions[0]).toHaveAttribute('aria-selected', String(false))
		expect(allOptions[1]).toHaveAttribute('aria-selected', String(true))

		await userEvent.keyboard('{ArrowUp}')
		expect(allOptions[0]).toHaveAttribute('aria-selected', String(true))
		expect(allOptions[1]).toHaveAttribute('aria-selected', String(false))

		await userEvent.keyboard('{End}')
		expect(allOptions[4]).toHaveAttribute('aria-selected', String(true))

		await userEvent.keyboard('{Home}')
		expect(allOptions[0]).toHaveAttribute('aria-selected', String(true))

		// Close the menu with keyboard input
		await userEvent.keyboard('{Escape}')
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
	})

	it('Autocomplete selections apply the value correctly with keyboard controls', async () => {
		render(
			<AutocompleteInput
				name="address1"
				id="address-address1"
				dataConnector={dataConnectorMock}
				onAutoCompleteSelected={handleAutocompleteSelectedMock}
				defaultValue={''}
				required
				label="Address"
			/>,
		)

		const inputEl = screen.getByRole('textbox', { name: 'Address' })
		await userEvent.type(inputEl, '111')
		expect(await screen.findByRole('listbox')).toBeInTheDocument()

		await userEvent.keyboard('{ArrowDown}')
		await userEvent.keyboard('{Enter}')
		expect(handleAutocompleteSelectedMock).toHaveBeenCalledWith(autocompleteResponseData[0].value)
	})

	it('Autocomplete selections apply the value correctly with mouse controls', async () => {
		render(
			<AutocompleteInput
				name="address1"
				id="address-address1"
				dataConnector={dataConnectorMock}
				onAutoCompleteSelected={handleAutocompleteSelectedMock}
				defaultValue={''}
				required
				label="Address"
			/>,
		)

		const inputEl = screen.getByRole('textbox', { name: 'Address' })
		await userEvent.type(inputEl, '111')
		expect(await screen.findByRole('listbox')).toBeInTheDocument()

		const allOptions = screen.getAllByRole('option')
		await userEvent.hover(allOptions[0])
		expect(allOptions[0]).toHaveAttribute('aria-selected', 'true')

		await userEvent.click(allOptions[0])
		expect(handleAutocompleteSelectedMock).toHaveBeenCalledWith(autocompleteResponseData[0].value)
		expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
	})

	it('Don`t show when we programmatically updating the field', async () => {
		const { rerender } = render(
			<AutoCompleteWithState
				val={''}
				dataConnectorMock={dataConnectorMock}
				handleAutocompleteSelectedMock={handleAutocompleteSelectedMock}
			/>,
		)
		const inputEl = screen.getByRole('textbox', { name: 'Address' })
		expect(inputEl).toHaveValue('')

		// now we will update the field and set the value outside of the component.
		rerender(
			<AutoCompleteWithState
				val={'updated text'}
				dataConnectorMock={dataConnectorMock}
				handleAutocompleteSelectedMock={handleAutocompleteSelectedMock}
			/>,
		)

		expect(inputEl).toHaveValue('updated text')
		await waitFor(() => {
			expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
		})
		expect(dataConnectorMock).not.toHaveBeenCalled()
	})
})
