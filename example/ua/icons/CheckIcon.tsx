import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function CheckIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none" {...getEnhancedIconProps(props)}>
			<path
				d="M0.5 8L5.48939 12.9894C5.49525 12.9953 5.50475 12.9953 5.51061 12.9894L15.5 3"
				strokeLinecap="round"
				strokeLinejoin="round"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
