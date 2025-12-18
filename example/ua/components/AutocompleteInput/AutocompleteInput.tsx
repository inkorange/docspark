'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './AutocompleteInput.module.scss'

import type { ChangeEvent, KeyboardEvent, Ref, FocusEvent, InputHTMLAttributes } from 'react'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { useDebouncedCallback } from '../hooks/useDebouncedCallback'
import { InputField } from '../InputField/InputField'
import type { FormFieldProps } from '../..'
import { sanitizeString } from '../lib/forms'

export type SuggestionData<T> = {
	label: string
	value: T
}

export interface AutocompleteInputProps<T> extends InputHTMLAttributes<HTMLInputElement>, FormFieldProps {
	/** The function fired when an onChange event is triggered on the input field. This returns an object of results that we present in an option listing. */
	dataConnector: (val: string) => Promise<SuggestionData<T>[]>
	/** Callback function used when an autosuggestion is selected on the autocomplete option list. */
	onAutoCompleteSelected: (val: T) => void
	subtext?: React.ReactNode
}

const KEYSTROKE_DEBOUNCE_TIMER = 100

/** An autocomplete component that binds the input field to an external data handler that returns suggestion data based on the input's value.
 *  This component leverages accessibility controls to toggle between options with the keyboard and make a selection.
 * */
export const AutocompleteInput = memo(
	React.forwardRef(function AutoCompleteInput<T>(
		{
			label,
			id,
			className = '',
			dataConnector,
			onAutoCompleteSelected,
			children,
			subtext,
			onChange: handleChangeProp,
			onBlur: handleBlurProp,
			...rest
		}: AutocompleteInputProps<T>,
		ref: Ref<HTMLInputElement> | undefined,
	): React.JSX.Element {
		const [suggestionData, setSuggestionData] = useState<SuggestionData<T>[]>([])
		const [selectedSuggestion, setSelectedSuggestion] = useState<number>(-1)
		const handleChange = useDebouncedCallback(async (e: ChangeEvent<HTMLInputElement>) => {
			handleChangeProp?.(e)
			if (!e.target?.value) {
				return
			}
			e.target.value = sanitizeString(e.target.value)
			if (document.activeElement === e.target) {
				const suggestionDataResponse = await dataConnector(e.target?.value ?? '')
				setSuggestionData(suggestionDataResponse)
			}
		}, KEYSTROKE_DEBOUNCE_TIMER)

		const handleSuggestionSelection = useCallback(
			(suggestionValue: T) => {
				onAutoCompleteSelected(suggestionValue)
				setSuggestionData([])
			},
			[onAutoCompleteSelected],
		)

		const handleBlur = useCallback(
			(e: FocusEvent<HTMLInputElement, Element>) => {
				setSuggestionData([])
				setSelectedSuggestion(-1)
				handleBlurProp?.(e)
			},
			[handleBlurProp],
		)

		const selectedValue = useMemo(
			() => (selectedSuggestion >= 0 && !!suggestionData.length ? suggestionData[selectedSuggestion]?.value : null),
			[selectedSuggestion, suggestionData],
		)

		const handleKeyEvents = useCallback(
			(e: KeyboardEvent<HTMLInputElement>) => {
				if (!suggestionData.length) return

				const inputElement = e.target as HTMLInputElement

				switch (e.key) {
					case 'Home':
						e.preventDefault()
						setSelectedSuggestion(0)
						break
					case 'End':
						e.preventDefault()
						setSelectedSuggestion(suggestionData.length - 1)
						break
					case 'Escape':
						handleBlur({ target: inputElement } as FocusEvent<HTMLInputElement, Element>)
						break
					case 'ArrowDown':
						e.preventDefault()
						setSelectedSuggestion(
							selectedSuggestion < 0 ? 0 : Math.min(selectedSuggestion + 1, suggestionData.length - 1),
						)
						break
					case 'ArrowUp':
						e.preventDefault()
						setSelectedSuggestion(selectedSuggestion < 0 ? 0 : Math.max(0, selectedSuggestion - 1))
						break
					case 'Enter':
						e.preventDefault()
						if (selectedValue) {
							handleSuggestionSelection(selectedValue)
							handleBlur({ target: inputElement } as FocusEvent<HTMLInputElement, Element>)
						}
						break
				}
			},
			[handleBlur, handleSuggestionSelection, selectedSuggestion, selectedValue, suggestionData],
		)

		return (
			<div className={`autocomplete-input ${styles['autocomplete-field']} ${className.trim()}`}>
				<InputField
					onFocus={handleChange}
					onBlur={handleBlur}
					onKeyDown={handleKeyEvents}
					onChange={handleChange}
					aria-expanded={suggestionData.length > 0}
					ref={ref}
					id={id}
					label={label}
					{...rest}
				/>
				{!!suggestionData.length && (
					<ul data-testid="suggestion-box" role="listbox" className={styles['autocomplete-item-container']}>
						{suggestionData.map((suggestion, i) => (
							<li
								onMouseDown={() => handleSuggestionSelection(suggestion.value)}
								onMouseEnter={() => setSelectedSuggestion(i)}
								data-format={'string'}
								role="option"
								key={`suggestionItem${i}`}
								aria-selected={suggestion.value === selectedValue}
								data-label={suggestion.label}
								data-value={suggestion.value}
							>
								{suggestion.label}
							</li>
						))}
					</ul>
				)}
				{subtext && <div className={styles.subtext}>{subtext}</div>}
			</div>
		)
	}),
)
