'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './CheckboxGroup.module.scss'

import React, { memo } from 'react'

interface CheckboxGroupProps {
	/** The collection of checkboxes shared name, as all checkboxes should be related to each other within this group. Used to target the validation error. */
	name: string
	/** The string used to put the legend above the checkbox collection. */
	label?: string
	className?: string
	/** When set to true, the alert div will not show, no validation errors will be presented. */
	noValidate?: boolean
	/** If supplied, this will present the validation error with this text. This is used outside the `useFormValidation` pattern. */
	errorText?: string
	children: React.ReactNode
}
/**
 * The `CheckboxGroup` component wraps Checkbox components in a container that will present the label above the
 * collection of checkboxes. It will also render a div that can present errors when that are thrown.
 */
export const CheckboxGroup = memo(function CheckboxGroup({
	className = '',
	label,
	name,
	errorText,
	noValidate = false,
	children,
}: CheckboxGroupProps) {
	return (
		<fieldset className={`${styles.checkboxGroup} ${className}`}>
			{label && <legend className="font-semibold">{label}</legend>}
			<div>{children}</div>
			{(!noValidate || errorText) && (
				<div id={`${name}-error`} role="alert">
					{errorText}
				</div>
			)}
		</fieldset>
	)
})
