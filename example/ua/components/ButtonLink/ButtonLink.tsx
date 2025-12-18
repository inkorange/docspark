'use client'

import type { ButtonVariant, ButtonVariantProps } from '../Button/Button'
import React, { forwardRef, useMemo } from 'react'
import { getVariantState } from '../Button/Button'
import styles from '../Button/Button.module.scss'

interface ButtonLinkProps<T extends React.ElementType> extends Pick<HTMLAnchorElement, 'href'>, ButtonVariantProps {
	as?: T
	passHref?: boolean
}

/**
 * A `LocaleLink` wrapping element that enforces the button styling on link tags, inheriting the same variant props as the `Button` component.
 */
export const ButtonLink = forwardRef(function ButtonLink<T extends React.ElementType>(
	{
		variant = 'primary',
		secondary,
		tertiary,
		text,
		hug,
		className,
		as,
		children,
		...attrs
	}: ButtonLinkProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonLinkProps<T>>,
	ref: React.Ref<HTMLAnchorElement>,
) {
	const variantState: ButtonVariant = useMemo(
		() =>
			getVariantState({
				variant,
				secondary,
				tertiary,
				text,
				hug,
			}),
		[hug, secondary, tertiary, text, variant],
	)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const Element: any = as ?? 'a'
	return (
		<Element
			ref={ref}
			role="button"
			data-variant={variantState}
			className={`${styles.btn} ${styles['btn__button-link']} ${styles[`btn__${variantState}`]} ${className?.trim()}`}
			{...attrs}
		>
			<span>{children}</span>
		</Element>
	)
})
