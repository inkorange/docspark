'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from '../styles/forms.module.scss'

import React, { memo, useEffect, useRef, useId, useState } from 'react'
import { exposeRefTo } from '../actions'
import type { FormFieldProps } from './FormFieldType'
import { keyReplace, useComponentContext } from '../../providers/UIComponentsProvider'

/**
 * If you need a string, and it's okay to default it to `''`.
 * Given `undefined` or `null`, return the `''` (the empty string)
 * Given a `string`, return it
 */
function ensureString(str: string | undefined | null): string {
	return str || ''
}

export const InputField = memo(
	React.forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
		{
			label,
			id,
			className = '',
			type = 'text',
			noValidate = false,
			errorText,
			floatingLabel = true,
			children,
			placeholder = ' ',
			prefixLabel,
			rounded,
			showCharacterCount = false,
			...rest
		}: FormFieldProps,
		ref,
	) {
		const inputRef = useRef<HTMLInputElement>(null)
		const formRef = useRef<HTMLDivElement>(null)
		const prefixContainerRef = useRef<HTMLDivElement>(null)
		const { getLabelText } = useComponentContext()
		const [characterCount, setCharacterCount] = useState(0)

		useEffect(() => {
			if (inputRef.current) {
				inputRef.current.value = ensureString((rest.defaultValue as string) ?? '')
			}
		}, [rest.defaultValue])

		/**
		 * This will set a console warning if showCharacterCount is enabled but maxLength is not set on the input field.
		 */
		useEffect(() => {
			const characterCountSettingsError = showCharacterCount && !rest.maxLength
			if (characterCountSettingsError) {
				console.warn(
					'InputField: showCharacterCount is enabled but maxLength is not set. Character count annotation cannot render.',
				)
			}
			setCharacterCount((rest.defaultValue as string)?.length ?? 0)
		}, [rest.defaultValue, rest.maxLength, showCharacterCount])

		useEffect(() => {
			function setPrefixContainerWidth() {
				formRef.current?.style.setProperty(
					'--form-field-label-offset-prefix',
					`${prefixContainerRef.current?.offsetWidth}px`,
				)
			}

			// When we have a prefix element, the placeholder needs to be situated to its left and animate to the focus position, this set the offset programatically to be natively picked up by the CSS transition.
			if (prefixLabel && prefixContainerRef && formRef) {
				setPrefixContainerWidth()
				// Sometimes offsetWidth is zero in production builds (and not dev, perhaps due to race condition), so retry setting width on next render cycle
				if (prefixContainerRef.current?.offsetWidth === 0) setTimeout(setPrefixContainerWidth, 0)
			}
		}, [prefixLabel, prefixContainerRef, formRef])

		const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			setCharacterCount(e.target.value.length)
			rest.onChange?.(e)
		}

		const generatedId = useId()

		return (
			<div
				ref={formRef}
				className={`${styles['form-field']} form-field ${rounded ? styles['form-field--rounded'] : ''} ${
					floatingLabel ? styles['form-field--floating-field'] : ''
				}`}
			>
				{prefixLabel && (
					<div ref={prefixContainerRef} data-testid="prefixLabel" className={styles['prefix-label-container']}>
						{prefixLabel}
					</div>
				)}
				<input
					ref={exposeRefTo(ref, inputRef)}
					type={type}
					id={id ?? generatedId}
					className={`${className.trim()}`}
					placeholder={floatingLabel && !placeholder ? ' ' : placeholder}
					aria-invalid={!!errorText}
					aria-describedby={noValidate ? undefined : `${id ?? generatedId}-error`}
					onChange={handleOnChange}
					{...rest}
				/>
				{floatingLabel && (
					<>
						<label className={styles['floating-label']} htmlFor={id ?? generatedId}>
							{label ?? placeholder}
						</label>
						<fieldset aria-hidden="true">
							<legend>{label ?? placeholder}</legend>
						</fieldset>
					</>
				)}
				{!noValidate && (
					<div id={`${id ?? generatedId}-error`} role="alert">
						{errorText}
					</div>
				)}
				{showCharacterCount && rest.maxLength && (
					<div className={styles['character-count-label']}>
						{keyReplace(getLabelText('InputField', 'characters-remaining'), { n: rest.maxLength - characterCount })}
					</div>
				)}
				{children}
			</div>
		)
	}),
)
