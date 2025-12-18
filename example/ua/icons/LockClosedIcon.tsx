import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function LockClosedIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<rect
				x="1"
				y="6"
				width="14"
				height="9"
				rx="2"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M12 5.5C12 3.567 10.2091 2 8 2C5.79086 2 4 3.567 4 5.5"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle
				cx="8"
				cy="9.75"
				r="1.75"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				fill="currentColor"
				d="M8 12V13.25"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
