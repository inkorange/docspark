import type { IconProps, IconSize, IconColor } from './icons'

export type IconPrimitive = React.ElementType<IconProps>

export const IconElement = ({
	Icon,
	size = 'SM',
	color,
	...attrs
}: {
	Icon: IconPrimitive
	size?: IconSize
	color?: IconColor
}) => {
	return <Icon {...attrs} size={size} color={color} />
}
