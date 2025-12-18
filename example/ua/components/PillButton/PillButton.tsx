/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './PillButton.module.scss'

import React from 'react'
import type { IconProps } from '../../icons/icons'
import { IconElement } from '../../icons/IconElement'
import { handleAccessibilityClick } from '../lib/util'

interface PillButtonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role' | 'onKeyDown'> {
	/** Sets the current selected state of the component, applying the selected styling. */
	selected?: boolean
	/** Presents a supplied icon prefixing the children elements, leveraging this implementation enforces the spacing, theme, and sizing of the icon in the PillButton */
	icon?: React.ElementType<IconProps>
}

/**
 * The PillButton component is a variation of the Button component where the core accessibility usages is that
 * of a tab element and not a call to action element. The component takes only one visual variation prop, `selected`, which
 * indicates if the item is in an enabled/selected state.
 *
 * When applying an icon element to the contents of the PillButton, it should be enforced to only add this via the `icon` prop
 * and not as part of the children elements. This is to ensure that the icon is properly sized, spaced, and colored based on the
 * selected state of the component. This keeps the display logic encapsulated within this primitive.
 */
export const PillButton = ({ id, selected, onClick, icon = null, className, children, ...attrs }: PillButtonProps) => {
	return (
		<div
			role="tab"
			tabIndex={onClick ? 0 : undefined}
			aria-selected={selected}
			onClick={onClick}
			onKeyDown={(e) => handleAccessibilityClick(e, onClick)}
			className={`${styles.pill_button} ${selected ? styles['pill_button--selected'] : ''} ${className ?? ''}`.trim()}
			{...attrs}
		>
			{icon && <IconElement size="SM" Icon={icon} />}
			<span>{children}</span>
		</div>
	)
}
