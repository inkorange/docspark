/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './QuoteBlock.module.scss'

import React, { type PropsWithChildren } from 'react'

interface QuoteBlockProps {
	/** Will render a supplied icon before the message */
	icon?: React.JSX.Element
	/** Overriding class for the component */
	className?: string
}

/**
 * The `QuoteBlock` component wraps annotated messages in a stylized "quote" design pattern. The message can be displayed
 * with or without an icon element.
 */
export const QuoteBlock = ({ className = '', icon, children, ...rest }: PropsWithChildren<QuoteBlockProps>) => {
	return children ? (
		<div className={`${styles['quote-block']} ${className}`} data-testid="quote-block" {...rest}>
			{icon}
			{children}
		</div>
	) : (
		<></>
	)
}
