import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function CaretUpIcon(restProps: IconProps) {
	return (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(restProps)}>
			<path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z" fill="currentColor" />
		</svg>
	)
}
