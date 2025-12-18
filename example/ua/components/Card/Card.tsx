'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './Card.module.scss'

import React, { forwardRef } from 'react'
import { CheckIcon } from '../../icons'
import type { CardProps } from './CardType'
import { handleAccessibilityClick } from '../lib/util'

/**
 * The Card component is a primitive wrapping component that houses html elements and properly format them to be visually clear for presenting important information to users.'
 */
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
	{ as: Element = 'div', className = '', selected = false, error = false, children, onClick, ...attrs }: CardProps,
	ref,
) {
	return (
		<Element
			tabIndex={onClick ? 0 : undefined}
			role={onClick ? 'button' : undefined}
			ref={ref}
			onClick={onClick}
			onKeyDown={(e) => handleAccessibilityClick(e, onClick)}
			className={`${styles.card} ${className} ${error ? styles['card--error'] : ''} ${
				onClick ? styles['card--onclick'] : ''
			}`.trim()}
			{...attrs}
			data-card
			data-selected={selected ? 'true' : 'false'}
		>
			<div>{children}</div>
			{selected && <CheckIcon size="SM" />}
		</Element>
	)
})
