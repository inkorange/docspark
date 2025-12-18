'use client'

import React, { forwardRef } from 'react'
import styles from './EditableCard.module.scss'

import { Card } from '../Card/Card'
import { type CardProps } from '../Card/CardType'
import { Button } from '../Button/Button'
import { useComponentContext } from '../../providers/UIComponentsProvider'

export interface EditableCardProps extends CardProps {
	onEdit?: (e?) => void
	onRemove?: () => void
	onClick?: (e?) => void
	errorMessage?: string
	children: NonNullable<React.ReactNode | React.ReactNode[]>
}

type CallbackFunction = (event: React.MouseEvent<HTMLButtonElement>) => void

/**
 * A component to render a summary of a given address. The card has controls to denote if the card is currently selected.
 *
 * **Localization Considerations:**
 *
 * This component requires localized text for the `Card` aria-label, `Edit` and `Remove` button text. These are configured in the configuration
 * provider under the following object:
 * ```typescript
 * EditableCard: {
 *     card: 'Card',
 *     edit: 'Edit',
 *     remove: 'Remove',
 * }
 * ```
 */
export const EditableCard = forwardRef<HTMLElement, EditableCardProps>(function EditableCard(
	{ onEdit, onRemove, onClick, errorMessage, children, className, ...attrs },
	ref,
): React.JSX.Element {
	const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, callback?: CallbackFunction) => {
		e.stopPropagation()
		callback?.(e)
	}
	const { getLabelText } = useComponentContext()
	return (
		<>
			<Card
				aria-label={getLabelText('EditableCard', 'card')}
				onClick={onClick}
				{...attrs}
				aria-invalid={!!errorMessage}
				className={className}
				error={!!errorMessage}
				ref={ref}
			>
				{children}
				{(onEdit || onRemove) && (
					<div className={styles.actions} role="group">
						{onEdit && (
							<Button text onClick={(e) => handleButtonClick(e, onEdit)}>
								{getLabelText('EditableCard', 'edit')}
							</Button>
						)}
						{onRemove && (
							<Button text onClick={(e) => handleButtonClick(e, onRemove)}>
								{getLabelText('EditableCard', 'remove')}
							</Button>
						)}
					</div>
				)}
			</Card>
			{errorMessage && (
				<p role="alert" className={styles['card-error']}>
					{errorMessage}
				</p>
			)}
		</>
	)
})
