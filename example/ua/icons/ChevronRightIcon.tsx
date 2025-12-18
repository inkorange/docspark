import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function ChevronRightIcon(restProps: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(restProps)}>
			<path
				d="M4.5 1L11.4894 7.98939C11.4953 7.99525 11.4953 8.00475 11.4894 8.01061L4.5 15"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
