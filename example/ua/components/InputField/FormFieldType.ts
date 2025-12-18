import type { ComponentPropsWithRef, InputHTMLAttributes, ReactNode } from 'react'

type IgnoredAttrs = Extract<keyof ComponentPropsWithRef<'input'>, 'hidden' | 'aria-hidden'>
export interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, IgnoredAttrs> {
	/** The text label that appears above the input, and acts like a placeholder in the realm of how our UA Design System works. If we apply a label here, we should NOT add a placeholder prop. */
	label: string | ReactNode
	/** Will not render any elements that deal with the display of invalid data */
	noValidate?: boolean
	/** Elements that will be rendered within the containing div with the ability to be positioned within the input */
	children?: ReactNode
	/** Text that overrides dynamic error messages, and puts the component into an error state if a value exists. Will only display if noValidate is false */
	errorText?: string | ReactNode
	/** If true - we show a floating label experience */
	floatingLabel?: boolean
	/** Element that will be prefixed to the input element */
	prefixLabel?: ReactNode | string
	/** Some form elements have a small variant that applies to the font-size of the label */
	small?: boolean
	/** Some form elements have a rounded variant that applies to the containing border around the element */
	rounded?: boolean
	/** If true, displays a character count below the input field, NOTE: This requires a maxLength prop to be set */
	showCharacterCount?: boolean
	/** Applying a theme to the form field elements, value can only be light or dark (light is defaulted) */
	theme?: 'light' | 'dark'
}
