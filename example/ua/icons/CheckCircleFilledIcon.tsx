import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function CheckCircleFilledIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none" {...getEnhancedIconProps(props)}>
			<circle cx="8" cy="8" r="8" fill="currentColor" />
			<path
				d="M4 7.99967L6.66313 10.6628C6.66508 10.6648 6.66825 10.6648 6.6702 10.6628L12 5.33301"
				stroke="var(--icon-alternate-color, var(--color-white))"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
