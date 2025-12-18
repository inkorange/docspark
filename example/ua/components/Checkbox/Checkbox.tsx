'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from '../styles/forms.module.scss'

import React, { memo, useEffect, useId, useRef } from 'react'
import { exposeRefTo } from '../actions'
import type { FormFieldProps } from '../..'
import CheckIcon from '../../icons/CheckIcon'

// If you need a boolean, and it's okay to default it to `0`
// Given `undefined` or `null`, return `false`
// Given a `boolean`, return it
export function ensureBoolean(boolean: boolean | undefined | null): boolean {
	return !!boolean
}

/**
 * Wrapper component to semantically describe the checkbox form element
 * and force type to be checkbox.
 */
export const Checkbox = memo(
	React.forwardRef<HTMLDivElement, FormFieldProps>(function Checkbox(
		{
			label,
			id: explicitId,
			noValidate,
			className = '',
			defaultChecked = false,
			small = false,
			theme = 'light',
			...rest
		}: Omit<FormFieldProps, 'type'>,
		ref,
	) {
		const accessibilityId = useId()
		const id = explicitId ?? accessibilityId
		const checkboxRef = useRef<HTMLInputElement>(null)
		useEffect(() => {
			const checkbox = checkboxRef.current
			function handleClick(event) {
				event.target.focus()
			}

			if (checkbox) {
				checkbox.checked = ensureBoolean(defaultChecked)
				checkbox.addEventListener('click', handleClick)
			}
			return () => checkbox?.removeEventListener('click', handleClick)
		}, [defaultChecked])

		return (
			<div className={`${styles['form-field']} form-field ${theme}`}>
				<input
					ref={exposeRefTo(ref, checkboxRef)}
					type="checkbox"
					id={id}
					className={`visually-hidden ${className.trim()}`}
					{...rest}
				/>

				<label htmlFor={id} className={small ? styles['small-label'] : ''}>
					{label}
					<CheckIcon className={styles['checkbox-check']} size="SM" />
				</label>
			</div>
		)
	}),
)
