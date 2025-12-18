import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function ChevronDownIcon(restProps: IconProps) {
	return (
		<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" data-caret-icon {...getEnhancedIconProps(restProps)}>
			<path
				d="M15 4.5L8.01061 11.4894C8.00475 11.4953 7.99525 11.4953 7.98939 11.4894L1 4.5"
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
