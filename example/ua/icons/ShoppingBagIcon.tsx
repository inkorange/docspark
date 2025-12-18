import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function ShoppingBagIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<path
				d="M1.5 5C1.5 4.72386 1.72386 4.5 2 4.5H14C14.2761 4.5 14.5 4.72386 14.5 5V15C14.5 15.2761 14.2761 15.5 14 15.5H2C1.72386 15.5 1.5 15.2761 1.5 15V5Z"
				strokeLinecap="round"
				strokeLinejoin="round"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d="M5 7.5V3C5 2 6 0.5 8 0.5C10 0.5 11 2 11 3V7.5"
				strokeLinecap="round"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
