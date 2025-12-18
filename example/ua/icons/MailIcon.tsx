import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function MailIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M2 3.5 8 8 15 3.5"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
			/>
			<rect
				strokeLinecap="round"
				strokeLinejoin="round"
				x="1"
				y="3"
				width="14.5"
				height="10"
				rx="1"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
