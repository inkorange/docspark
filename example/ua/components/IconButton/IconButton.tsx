import React from 'react'
import styles from './IconButton.module.scss'
import type { IconProps, IconSize } from '../../icons/icons'
import { Button, type ButtonVariantProps } from '../Button/Button'
import { IconElement } from '../../icons/IconElement'

interface IconButtonProps extends React.ComponentPropsWithoutRef<'button'> {
	/** Adding a class to the component */
	className?: string
	/** Similar to the values form the `button`, we can set the iconButton to be of variant. */
	variant?: ButtonVariantProps['variant']
	/** Similar to the values form the `button`, we can set the iconButton to be of type `submit` or `button`. */
	type?: React.ComponentPropsWithoutRef<'button'>['type']
	/** The onClick handler callback */
	onClick?: React.ComponentPropsWithoutRef<'button'>['onClick']
	/** The size of the icon within the button */
	size?: IconSize
	/** Accessibility hidden label adjacent to the icon, to describe it. */
	label: string
	/** An IconProps Element type passed through, not as a JSX, Example: icon={CloseIcon} */
	icon: React.ElementType<IconProps>
}

/**
 * An `IconButton` component enforces the styling around the Button and Icon interfaces within our app's design system.
 * The icon styling is enforced via this component, and we can only pass-through the Icon ElementType, not the JSX object.
 *
 * The default size is `SM`, and the default variant is `primary`. This will extend the Button component and leverage all of
 * the accessibility and interaction patterns of a standard button.
 */
export const IconButton = ({
	className = '',
	size = 'SM',
	type,
	icon,
	label,
	variant = 'text',
	onClick,
	...attrs
}: IconButtonProps) => {
	return (
		<Button
			type={type}
			variant={variant}
			aria-label={label}
			data-size={size}
			data-variant={variant}
			className={`${styles.icon_button} ${className}`}
			onClick={onClick}
			{...attrs}
		>
			{icon && <IconElement size={size} Icon={icon} />}
		</Button>
	)
}
