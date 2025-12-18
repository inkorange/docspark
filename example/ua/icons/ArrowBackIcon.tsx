import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function ArrowBackIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<path
				d="M5 4L1.10607 7.89393C1.04749 7.95251 1.04749 8.04749 1.10607 8.10607L5 12"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				vectorEffect="non-scaling-stroke"
				d="M15.5 8H1"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
