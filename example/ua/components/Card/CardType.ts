import type { ElementType, HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLElement> {
	/** will make the root element render as a specific tag */
	as?: ElementType
	/** Setting that will render the card as a selected item */
	selected?: boolean
	/** Will put the card into an error state, wrapping the container in an error colored border */
	error?: boolean
	children: NonNullable<ReactNode>
}
