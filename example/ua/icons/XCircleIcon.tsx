import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function XCircleIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<circle cx="8" cy="8" r="7.5" stroke="currentColor" vectorEffect="non-scaling-stroke" />
			<path
				d="M3.40893 3.77148L6.97363 8.53882L3.38672 12.415H4.19422L7.33486 9.02152L9.87218 12.415H12.6196L8.85454 7.37949L12.1934 3.77148H11.3859L8.49385 6.8968L6.15692 3.77148H3.40946H3.40893ZM4.59607 4.36632H5.85796L11.4314 11.8202H10.1695L4.59607 4.36632Z"
				fill="currentColor"
			/>
		</svg>
	)
}
