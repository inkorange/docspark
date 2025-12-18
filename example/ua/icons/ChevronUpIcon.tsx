import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function ChevronUpIcon(restProps: IconProps) {
	return (
		<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" data-caret-icon {...getEnhancedIconProps(restProps)}>
			<path
				d="M1 11.5L7.98939 4.51061C7.99525 4.50475 8.00475 4.50475 8.01061 4.51061L15 11.5"
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
