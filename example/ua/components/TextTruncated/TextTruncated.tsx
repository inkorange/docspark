/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './TextTruncated.module.scss'

import React from 'react'

type TextTruncatedProps<P = unknown> = P & {
	/* The text to split */
	text: string
	/* Ratio of where to split the string, where 0.5 is the middle. (Default is 0.8) */
	splitRatio?: 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9
}

/**
 * This component automatically truncates text keeping only the beginning and end of the string.
 * It does so by splitting the provided string in two parts and applying a text-overflow on the
 * first half.
 *
 * Example: #12345678910123456 --> #1234...3456
 */
export const TextTruncated = ({ text, splitRatio = 0.8, ...rest }: TextTruncatedProps) => {
	const halfLen = Math.round(text.length * splitRatio)
	const parts = halfLen > 1 ? [text.slice(0, halfLen), text.slice(halfLen)] : [text]
	return (
		<div className={styles['text-truncated']} title={text} {...rest}>
			<span className={styles.left} data-testid="truncated-first-half">
				{parts[0]}
			</span>
			{parts.length > 1 && <span className={styles.right}>{parts[1]}</span>}
		</div>
	)
}
