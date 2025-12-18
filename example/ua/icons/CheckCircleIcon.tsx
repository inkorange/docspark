import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function CheckCircleIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)} fill="none">
			<circle cx="50%" cy="50%" r="23" stroke="currentcolor" vectorEffect="non-scaling-stroke" />
			<path
				d="M15 24L20.9894 29.9894C20.9953 29.9953 21.0047 29.9953 21.0106 29.9894L33 18"
				stroke="currentcolor"
				vectorEffect="non-scaling-stroke"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
