'use client'

import React, { useCallback, useState } from 'react'
import { InputField } from '../InputField/InputField'
import { useComponentContext } from '../../providers/UIComponentsProvider'

type IgnoredAttrs = Extract<keyof React.ComponentPropsWithRef<'input'>, 'hidden' | 'aria-hidden'>

export interface PasswordFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, IgnoredAttrs> {
	/** The label for the input field */
	label: string | React.ReactNode
	/** The text that will display when an error is thrown on this input. */
	errorText?: string
	/** This will toggle the Show/Hide button functionality */
	showMaskButton?: boolean
	/** Accessibility label for the Show/Hide button */
	buttonMaskLabel?: string | React.ReactNode
}

/**
 * An `InputField` wrapping component specific for password entry controls. This component allows for the input field
 * to toggle from type `password` to `text` when the Show/Hide button is interacted.
 *
 * **Localization Considerations:**
 *
 * This component requires localized text for the `Show` and `Hide` button text. These are configured in the configuration
 * provider under the following object:
 * ```typescript
 * PasswordField: {
 *     show: 'Show',
 *     hide: 'Hide',
 * }
 * ```
 */
export const PasswordField = ({
	label,
	showMaskButton = true,
	buttonMaskLabel,
	type,
	...inputProps
}: PasswordFieldProps) => {
	const [passwordType, setPasswordType] = useState<'password' | 'text'>('password')
	const { getLabelText } = useComponentContext()

	const toggleShowHidePassword = useCallback(
		(e) => {
			e.preventDefault()
			setPasswordType(passwordType === 'password' ? 'text' : 'password')
		},
		[passwordType],
	)
	return (
		<>
			<InputField label={label} type={passwordType} {...inputProps}>
				{showMaskButton && (
					<button
						role="switch"
						type="button"
						aria-checked={passwordType === 'password'}
						onClick={toggleShowHidePassword}
					>
						<span aria-hidden>{getLabelText('PasswordField', passwordType === 'password' ? 'show' : 'hide')}</span>
						<span className="visually-hidden">{buttonMaskLabel}</span>
					</button>
				)}
			</InputField>
		</>
	)
}
