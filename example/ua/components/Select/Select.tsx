'use client'

/* eslint-disable consistent-return -- Disabling this simplifies the code in this component */
/* eslint "@typescript-eslint/explicit-module-boundary-types": "error" -- Guarantees safety with previous disable */

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './Select.module.scss'

import React, { useCallback, useEffect, useMemo, useRef, type PropsWithChildren } from 'react' // TODO: Import `useId`
import { ChevronUpIcon, CheckIcon } from '../../icons'

/* -------------------- Types -------------------- */
type OptionObject = { label: string; value: string; disabled?: boolean }

type IgnoredAttrs = Extract<
	keyof React.ButtonHTMLAttributes<HTMLButtonElement>,
	'type' | 'role' | 'aria-haspopup' | 'aria-controls' | 'aria-expanded' | 'aria-activedescendant'
>

export interface SelectProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, IgnoredAttrs> {
	// TODO: Once we upgrade to `react@18`, loosen restriction and default to `useId` hook as needed
	/** Specifies type of Select component that will be used */
	id: string
	/** Parameter to Option component that describes what type of option it will describe */
	value?: string
	/** Allows defining a custom callback when the `onInput` event is fired on the select component. */
	onInput?: (e) => void
	/** Allows defining a custom callback when the `onChange` event is fired on the select component. */
	onChange?: (e) => void
	children: React.ReactElement<OptionProps> | (React.ReactElement<OptionProps> | React.ReactElement<OptionProps>[])[]
	/** This component doesn't work uncontrolled by default, so we pass a flag to allow it. Consider removing this flag in future and make it default behavior after more testing */
	uncontrolled?: boolean
	/** Floating label */
	label?: string
}

/* -------------------- Option -------------------- */
interface OptionProps extends PropsWithChildren {
	value?: string
	disabled?: boolean
}

/** An `option` provided to the `Select` component */
export function Option({ children }: OptionProps): React.ReactElement {
	return <>{children}</>
}

/**
 * Enhanced `select`-like component, compliant with the `combobox` a11y requirements.
 * The select component provides a dropdown of options for the user to select. The component initially display the default selected item and when clicked, will show a dropdown one or more options for the user to select. The component is used in various parts of the site such as when choosing a quantity of a specific item being viewed or as part of other components such as Pagination.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/combobox_role}
 * @see {@link https://www.w3.org/WAI/ARIA/apg/patterns/combobox/}
 */
export const Select = ({
	id,
	name,
	value: valueProp,
	defaultValue,
	onInput,
	onChange,
	children,
	uncontrolled,
	className = '',
	label,
	...comboboxAttrs
}: SelectProps): React.ReactElement => {
	/* -------------------- Constants -------------------- */
	const combobox = useRef({} as HTMLButtonElement)
	const comboboxSearch = useRef('')
	const comboboxTimer = useRef(-1)

	const listbox = useRef({} as HTMLUListElement)
	const hiddenField = useRef({} as HTMLInputElement)

	/** All of the potential options within the component. */
	const options = useMemo(() => {
		type ChildrenArray = Exclude<typeof children, React.ReactElement<OptionProps>>
		const childrenArray = React.Children.toArray(children) as ChildrenArray

		return childrenArray
			.flatMap(function extractOptionData(child, _, arr): OptionObject | null | (OptionObject | null)[] {
				if (!Array.isArray(child)) {
					if (child.type !== Option) return null

					const { children: label, value, disabled, ...rest } = child.props
					return Object.assign(rest, {
						label: label?.toString() || '',
						value: value ?? label?.toString() ?? '',
						disabled,
					})
				}

				// ONLY go 1 level deep for nested children arrays
				if (arr !== childrenArray) return null
				return child.flatMap(extractOptionData)
			})
			.filter((o): o is OptionObject => o !== null)
	}, [children])

	/* -------------------- Respond to `Active Option` Updates -------------------- */
	useEffect(() => {
		const observer = new MutationObserver((mutationList) => {
			mutationList.forEach((mutation) => {
				// Deactivate previous `option`
				const previouslyActiveOptionEl = document.getElementById(mutation.oldValue as string)
				previouslyActiveOptionEl?.removeAttribute('data-active')

				// Get the `combobox` and the active `option`
				const mutatedCombobox = mutation.target as HTMLUListElement
				const activeOptionId = mutatedCombobox.getAttribute('aria-activedescendant') as string
				const activeOptionEl = document.getElementById(activeOptionId)
				if (!activeOptionEl) return

				// Specify new active `option`
				activeOptionEl.setAttribute('data-active', String(true))

				// Update `listbox` Scroll Position
				const bounds = listbox.current.getBoundingClientRect()
				const { top, bottom, height } = activeOptionEl.getBoundingClientRect()

				const listboxStyles = getComputedStyle(listbox.current)
				const border = parseInt(listboxStyles.getPropertyValue('--select-border'), 10)
				const padding = parseInt(listboxStyles.getPropertyValue('--select-base-padding'), 10) * 0.5
				if (top < bounds.top) listbox.current.scrollTop = activeOptionEl.offsetTop + padding / 2 - border
				else if (bottom > bounds.bottom) {
					const listboxAdjustedHeight = bounds.height - padding - 2 * border
					listbox.current.scrollTop = activeOptionEl.offsetTop - listboxAdjustedHeight + height
				}
			})
		})

		observer.observe(combobox.current, {
			attributes: true,
			attributeFilter: ['aria-activedescendant'],
			attributeOldValue: true,
		})

		return () => observer.disconnect()
	}, [])

	/* -------------------- Update `Active Option` When `combobox` Opens -------------------- */
	useEffect(() => {
		const observer = new MutationObserver((mutationList) => {
			mutationList.forEach((mutation) => {
				const mutatedCombobox = mutation.target as HTMLButtonElement
				const expanded = mutatedCombobox.getAttribute('aria-expanded') === String(true)
				if (!expanded) return listbox.current.setAttribute('hidden', String(true))

				const currentOptionId = mutatedCombobox.value ? `${mutatedCombobox.id}-option-${mutatedCombobox.value}` : ''
				mutatedCombobox.setAttribute('aria-activedescendant', currentOptionId)
				listbox.current.removeAttribute('hidden')
			})
		})

		observer.observe(combobox.current, { attributes: true, attributeFilter: ['aria-expanded'] })
		return () => observer.disconnect()
	}, [])

	/* -------------------- Select `value` Prop Update Logic -------------------- */
	/** Determines if the `testValue` is valid for the `Select` component. Used for checking the `value` prop only. */
	const valueIsValid = useCallback((testValue: string) => options.some((o) => testValue === o.value), [options])

	useEffect(() => {
		if (valueProp == null) return
		if (!valueIsValid(valueProp)) return combobox.current.removeAttribute('value') // Empty the Component's value
		combobox.current.setAttribute('value', valueProp) // Set Component Value
	}, [id, valueProp, valueIsValid, options])

	// Synchronize `combobox` Value with Accessibility + Hidden `input` Value
	useEffect(() => {
		const localHiddenFieldRef = hiddenField.current
		const localListboxRef = listbox.current

		const observer = new MutationObserver((mutationList) => {
			mutationList.forEach((mutation) => {
				const mutatedCombobox = mutation.target as HTMLButtonElement
				const selectedOption = document.getElementById(`${id}-option-${mutatedCombobox.value}`)

				// Bail out if an invalid `value` was supplied
				if (mutatedCombobox.hasAttribute('value') && !selectedOption) return mutatedCombobox.removeAttribute('value')

				// Update `combobox` Label
				mutatedCombobox.childNodes[0].textContent = selectedOption?.getAttribute('data-label') ?? ''

				// Update `selected` Option
				Array.from(localListboxRef.children).forEach((c) => c.setAttribute('aria-selected', String(false)))
				selectedOption?.setAttribute('aria-selected', String(true))

				// Update Hidden `input` value
				if (!mutatedCombobox.hasAttribute('value')) localHiddenFieldRef.removeAttribute('value')
				else localHiddenFieldRef.setAttribute('value', mutatedCombobox.getAttribute('value') as string)
			})
		})

		observer.observe(combobox.current, { attributes: true, attributeFilter: ['value'] })
		return () => observer.disconnect()
	}, [id])

	// Properly Trigger `onInput` and `onChange` Events
	useEffect(() => {
		if (!onInput && !onChange) return
		const localComboboxRef = combobox.current

		if (onInput) localComboboxRef.addEventListener('input', onInput as unknown as EventListener)
		if (onChange) localComboboxRef.addEventListener('change', onChange as unknown as EventListener)

		return () => {
			if (onInput) localComboboxRef.removeEventListener('input', onInput as unknown as EventListener)
			if (onChange) localComboboxRef.removeEventListener('change', onChange as unknown as EventListener)
		}
	}, [onInput, onChange])

	/* -------------------- Registered Event Handlers for Elements -------------------- */
	const comboboxHandlers: React.ButtonHTMLAttributes<HTMLButtonElement> = {
		onClick(event) {
			const button = event.currentTarget
			const expanded = button.getAttribute('aria-expanded') === String(true)

			button.setAttribute('aria-expanded', String(!expanded))
			button.focus()
		},
		onKeyDown(event) {
			const button = event.currentTarget
			const expanded = button.getAttribute('aria-expanded') === String(true)

			const activeOptionId = button.getAttribute('aria-activedescendant') as string
			const activeOption = document.getElementById(activeOptionId)

			if (event.key === 'Enter' || event.key === ' ') {
				// Run as normal, including submissions
				if (!expanded) {
					if (event.key === 'Enter') {
						event.preventDefault()
						button.form?.requestSubmit()
					}

					return
				}

				// Select `option`
				event.preventDefault()
				activeOption?.click()
			}
			// Select `option` AND navigate away
			if (event.key === 'Tab') {
				if (!expanded) return
				activeOption?.click()
			}
			// Close `listbox`
			else if (event.key === 'Escape') {
				if (expanded) button.setAttribute('aria-expanded', String(false))
			}
			// Move cursor up
			else if (event.key === 'ArrowUp') {
				event.preventDefault()
				if (!expanded) return event.currentTarget.setAttribute('aria-expanded', String(true))

				const option = activeOption
				if (!option) button.setAttribute('aria-activedescendant', listbox.current.children[0].id)
				else button.setAttribute('aria-activedescendant', option.previousElementSibling?.id || option.id)
			}
			// Move cursor down
			else if (event.key === 'ArrowDown') {
				event.preventDefault()
				if (!expanded) return event.currentTarget.setAttribute('aria-expanded', String(true))

				const option = activeOption
				if (!option) button.setAttribute('aria-activedescendant', listbox.current.children[0].id)
				else button.setAttribute('aria-activedescendant', option.nextElementSibling?.id || option.id)
			}
			// Move to first item
			else if (event.key === 'Home') {
				event.preventDefault()
				if (!expanded) return event.currentTarget.setAttribute('aria-expanded', String(true))

				button.setAttribute('aria-activedescendant', listbox.current.children[0].id)
			}
			// Move to last item
			else if (event.key === 'End') {
				event.preventDefault()
				if (!expanded) return event.currentTarget.setAttribute('aria-expanded', String(true))

				const optionElements = listbox.current.children
				button.setAttribute('aria-activedescendant', optionElements[optionElements.length - 1].id)
			}
			// Type-ahead Search
			else if (/[ -~]/.test(event.key) && !event.altKey && !event.metaKey && !event.ctrlKey) {
				if (!expanded) return button.setAttribute('aria-expanded', String(true))

				// Reset search-clearing Timer
				clearTimeout(comboboxTimer.current)
				comboboxTimer.current = window.setTimeout(() => (comboboxSearch.current = ''), 500)

				// Do not repeat the starting key
				if (event.key.toLowerCase() !== comboboxSearch.current.toLowerCase()) comboboxSearch.current += event.key

				// Activate the next searched option
				const optionEls = Array.from(listbox.current.children)
				const shift = optionEls.findIndex((o) => o.id === button.getAttribute('aria-activedescendant')) + 1

				const labels = options.map((o) => o.label)
				const shiftedLabels = labels.slice(shift).concat(labels.slice(0, shift))

				const nextShiftedIndex = shiftedLabels.findIndex((l) => new RegExp(`^${comboboxSearch.current}`, 'i').test(l))
				const nextUnshiftedIndex = nextShiftedIndex + shift
				const nextIndex = nextUnshiftedIndex >= labels.length ? nextUnshiftedIndex - labels.length : nextUnshiftedIndex

				if (nextShiftedIndex < 0) {
					comboboxSearch.current = ''
					clearTimeout(comboboxTimer.current)
					return
				}

				button.setAttribute('aria-activedescendant', listbox.current.children[nextIndex].id)
			}
		},
	}

	// Watch for `click`s outside the Component
	useEffect(() => {
		const localComboboxRef = combobox.current
		function handleOutsideClick(event: MouseEvent) {
			if (localComboboxRef.parentElement?.contains(event.target as Element)) return

			const expanded = localComboboxRef.getAttribute('aria-expanded') === String(true)
			if (expanded) localComboboxRef.setAttribute('aria-expanded', String(false))
		}

		document.addEventListener('click', handleOutsideClick)
		return () => document.removeEventListener('click', handleOutsideClick)
	}, [])

	const optionHandlers: React.HTMLAttributes<HTMLLIElement> = {
		onMouseOver(event) {
			combobox.current.setAttribute('aria-activedescendant', event.currentTarget.id)
		},
		onClick(event) {
			const optionEl = event.currentTarget
			if (optionEl.getAttribute('aria-disabled') === String(true)) return

			// Update values
			if (combobox.current.value !== optionEl.dataset.value) {
				combobox.current.setAttribute('value', optionEl.dataset.value as string)
				combobox.current.dispatchEvent(new InputEvent('input', { bubbles: true }))
				combobox.current.dispatchEvent(new Event('change', { bubbles: true }))
			}

			// Run effects
			combobox.current.setAttribute('aria-expanded', String(false))
			combobox.current.focus()
		},
	}

	/* -------------------- Rendering + Initial Values -------------------- */
	const initialOption = useMemo(() => {
		if (valueProp == null) return options[0]
		if (!valueIsValid(valueProp)) return { value: undefined, label: '' }
		return options.find((o) => o.value === valueProp) as OptionObject
	}, [valueProp]) // eslint-disable-line react-hooks/exhaustive-deps -- Need this to run only on mount

	/**
	 * When we have the field filled in with auto complete, we can detect the update to the input field
	 * and propagate the value to the combobox, which presents it in the view.
	 */
	const fieldChanged = (e) => {
		if (!e?.target) return
		// only if there is an update and the incoming value is one of the options available for the select
		// will if apply the value externally (IE: autofill via userAgent)
		if (e?.target.value !== defaultValue && options.some((item) => item.value === e.target.value)) {
			combobox.current.value = e.target.value
			if (onChange) {
				onChange(e)
			}
		}
	}

	/** When uncontrolled, set the initial value on component mount */
	useEffect(() => {
		if (!uncontrolled) return
		hiddenField.current.setAttribute('value', initialOption?.value?.toString() ?? defaultValue?.toString() ?? '')
	}, [uncontrolled, initialOption?.value, defaultValue])

	return (
		<div className={`${styles.select} ${className}`} data-select>
			<input
				ref={hiddenField}
				name={name}
				value={uncontrolled ? undefined : initialOption?.value ?? defaultValue ?? ''}
				onChange={fieldChanged}
				type="text"
				tabIndex={-1}
				aria-hidden={true}
				aria-describedby={`${id}-error`}
			/>
			<button
				ref={combobox}
				id={id}
				name={name != null ? `${name}-combobox` : undefined}
				type="button"
				role="combobox"
				aria-controls={`${id}-listbox`}
				aria-haspopup="listbox"
				aria-expanded={false}
				value={initialOption?.value ?? defaultValue ?? ''}
				aria-activedescendant={`${id}-option-${initialOption?.value ?? options[0]?.value}`}
				{...comboboxAttrs}
				{...comboboxHandlers}
			>
				<span className={initialOption.value ? '' : styles['untouched-label']}>{initialOption?.label}</span>
				{!comboboxAttrs.disabled && <ChevronUpIcon size="SM" />}
			</button>
			<ul ref={listbox} id={`${id}-listbox`} role="listbox" hidden>
				{options.map(({ label, value, disabled, ...customAriaOrDataAttrs }) => (
					<li
						{...customAriaOrDataAttrs} // Do this FIRST so that the COMPONENT can override important attributes
						key={`${id}-option-${value}`}
						id={`${id}-option-${value}`}
						role="option"
						aria-disabled={disabled}
						aria-selected={value === initialOption?.value}
						data-label={label}
						data-value={value}
						{...optionHandlers}
					>
						{label}
						<CheckIcon size="XS" />
					</li>
				))}
			</ul>
			{label && (
				<fieldset aria-hidden="true">
					<legend>{label}</legend>
				</fieldset>
			)}
			<div id={`${id}-error`} role="alert" />
		</div>
	)
}
