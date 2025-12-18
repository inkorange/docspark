'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './Radio.module.scss'

import React, { memo, useEffect, useRef, type ReactNode, type ChangeEvent, type InputHTMLAttributes } from 'react'
import { exposeRefTo } from '../actions'

/**
 * If you need a string, and it's okay to default it to `''`.
 * Given `undefined` or `null`, return the `''` (the empty string)
 * Given a `string`, return it
 */
function ensureString(str: string | undefined | null): string {
	return str || ''
}

type IgnoredAttrs = Extract<keyof React.ComponentPropsWithRef<'input'>, 'hidden' | 'aria-hidden' | 'onChange'>

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, IgnoredAttrs> {
	/** Unique identifier for this radio, required to be an isolated element when used with similar named input fields (radio group) */
	id: string
	/** Used for grouping radio inputs and requesting the form's value of these grouped selection */
	name: string
	/** Define the specific value of the input for use when the grouped item changes. */
	value?: string
	/** if controlled, this will set the checked state of the input */
	checked?: boolean
	/** Puts the label and input into a disabled, non-interactable state */
	disabled?: boolean
	/** Extended class for the wrapping label element */
	className?: string
	/** Elements that will be rendered within the containing div with the ability to be positioned within the input */
	children?: ReactNode
	/** Callback with the event, id, and value of this field being toggled */
	onChange?: (e: ChangeEvent<HTMLInputElement>, id: string, value: string | undefined) => void
}

/**
 * The Radio component wraps the `input[type=radio]` element with a label-binding display to enforce the input control and label look and feel
 */
export const Radio = memo(
	React.forwardRef<HTMLInputElement, RadioProps>(function FormField(
		{ id, name, value, className = '', onChange, checked, disabled = false, children, ...rest },
		ref,
	) {
		const inputRef = useRef<HTMLInputElement>(null)
		useEffect(() => {
			if (inputRef.current) {
				inputRef.current.value = ensureString((rest.defaultValue as string) ?? '')
			}
		}, [rest.defaultValue])

		const handleOnChange = (e) => {
			if (!onChange) return
			onChange(e, id, value)
		}

		return (
			<label
				aria-disabled={disabled}
				className={`${styles.label} ${!children ? styles['label__no-label'] : ''} ${className}`}
				htmlFor={id}
			>
				<input
					type="radio"
					ref={exposeRefTo(ref, inputRef)}
					name={name}
					id={id}
					value={value}
					checked={checked}
					aria-checked={checked}
					disabled={disabled}
					onChange={handleOnChange}
					className={styles.radio}
					{...rest}
					tabIndex={0}
				/>
				<span>{children}</span>
			</label>
		)
	}),
)
