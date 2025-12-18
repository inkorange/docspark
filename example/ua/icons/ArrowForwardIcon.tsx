import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function ArrowForwardIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<path
				d="M11 4L14.8939 7.89393C14.9525 7.95251 14.9525 8.04749 14.8939 8.10607L11 12"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				vectorEffect="non-scaling-stroke"
				d="M0.5 8H15"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
