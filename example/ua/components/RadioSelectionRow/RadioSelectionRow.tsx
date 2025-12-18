'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './RadioSelectionRow.module.scss'

import React, { memo, type PropsWithChildren } from 'react'
import { Button } from '../Button/Button'
import { Radio } from '../Radio/Radio'
import { useComponentContext } from '../../providers/UIComponentsProvider'

interface RadioSelectionRowProps {
	/** The id for reference and unique identifier for composition in a form */
	id: string
	/** The name of the field for access to the value */
	name: string
	/** Sets the checked state, as this is a controlled form */
	isChecked: boolean
	/** Overriding class for the decoration of the component */
	className?: string
	/** Callback for when the user clicks the input */
	onClick?: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void
	/** This component can present an edit link if this callback is supplied */
	onEdit?: (e: Event | React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

/**
 * A controlled radio button group that will also present an Edit link if the callback function is supplied
 * to the input. It is important to know that this component is controlled, thus the checked value is required to
 * be passed through to the component.
 *
 * **Localization Considerations:**
 *
 * This component requires localized text for the `Show` and `Hide` button text. These are configured in the configuration
 * provider under the following object:
 * ```typescript
 * RadioSelectionRow: {
 *     edit: 'Edit',
 * }
 * ```
 */
export const RadioSelectionRow = memo(function RadioSelectionRow({
	id,
	name,
	className,
	onClick,
	onEdit,
	isChecked,
	children,
}: PropsWithChildren<RadioSelectionRowProps>) {
	const { getLabelText } = useComponentContext()

	const handleOnClick = (e) => {
		if (!onClick) return
		onClick(e, id)
	}

	return (
		<label htmlFor={`${name}-${id}`} className={`${styles['radio-selection-container']} ${className}`} key={id}>
			<Radio
				name={name}
				data-testid={`${name}-${id}`}
				id={`${name}-${id}`}
				value="true"
				checked={isChecked}
				onChange={handleOnClick}
				className={styles['input-slot']}
			/>
			{children}
			{onEdit && (
				<Button text onClick={onEdit} className={styles['edit-button']}>
					{getLabelText('RadioSelectionRow', 'edit')}
				</Button>
			)}
		</label>
	)
})
