'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './LoadingDots.module.scss'

import React, { memo } from 'react'

const shapeAttrs = {
	circle: { r: '50%', cx: '50%', cy: '50%' },
	rect: { width: '100%', height: '100%' },
} as const

export interface LoadingDotsProps {
	/** Overriding class to update the styling */
	className?: string
	/** Defines the physical shape of the dots that are presented for the loader Can be `rect` or `circle` (default) */
	shape?: 'rect' | 'circle'
}

/**
 * Animated three blocks which indicate that page, or component section, content is loading
 */
export const LoadingDots = memo(function LoadingDots({ shape: Shape = 'circle', className = '' }: LoadingDotsProps) {
	return (
		<div
			className={`${styles['loading-dots']} ${className}`}
			aria-hidden
			data-testid="data-loading-dots"
			data-loading-dots
		>
			{Array.from(Array(3)).map((_, i) => (
				<svg key={i} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
					<Shape {...shapeAttrs[Shape]} />
				</svg>
			))}
		</div>
	)
})
