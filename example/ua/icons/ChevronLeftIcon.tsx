import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function ChevronLeftIcon(restProps: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(restProps)}>
			<path
				d="M11.5 15L4.50338 8.01062C4.49751 8.00476 4.49751 7.99524 4.50338 7.98938L11.5 1"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
