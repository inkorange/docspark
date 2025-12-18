/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './UaSkeleton.module.scss'

import React, { useMemo } from 'react'

export interface SkeletonProps {
	/**
	 * The color of the animated loader, this will default to `lightgray` if none supplied
	 */
	color?: string
	/**
	 * The width of the loader in CSS attribute value
	 */
	width?: number | string
	/**
	 * The height of the loader in CSS attribute value
	 */
	height?: number | string
	/**
	 * The variant for the loader. If using the `text` variant, a defaulted rounded corner will be applied,
	 * and if there is a font-size applied to the component, it will inherit that size and the height would
	 * be flexible based on that font-size.
	 * `circular` will apply a 50% rounded corner by default, and `rectangular` will have no rounding.
	 */
	variant?: 'text' | 'rectangular' | 'circular'
	/**
	 * If rectangular, this radius setting, as a CSS attribute value, will be used as the radius, otherwise it will default to 0
	 */
	cornerRadius?: number | string
	/**
	 * Will add a custom class to the component.
	 */
	className?: string
}

/**
 * The UA Skeleton component emulates the loading state of the content it represents. There are three different
 * variants, `text`, `rectangular`, and `circular` that represent the different shapes of the content within our app.
 */
export function UaSkeleton({
	color,
	variant = 'rectangular',
	width,
	height,
	cornerRadius,
	className = '',
	...attrs
}: SkeletonProps) {
	const backgroundColor = color || 'lightgray'
	const borderRadius = useMemo(() => {
		switch (variant) {
			case 'text':
				return 'var(--border-radius-small)'
			case 'circular':
				return '50%'
			default:
				return cornerRadius || 0
		}
	}, [cornerRadius, variant])

	return (
		<div
			className={`${styles.skeleton} ${className}`}
			{...attrs}
			style={{ backgroundColor, borderRadius, width, height }}
		>
			&nbsp;
		</div>
	)
}
