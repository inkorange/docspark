import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function ShopIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<g>
				<path
					d="M3.79571 4.12127C3.71681 3.80569 3.95549 3.5 4.28078 3.5H14.8195C15.1285 3.5 15.3635 3.77743 15.3127 4.0822L14.6461 8.0822C14.6059 8.32329 14.3973 8.5 14.1529 8.5H5.28078C5.05134 8.5 4.85135 8.34385 4.79571 8.12127L3.79571 4.12127Z"
					stroke="currentColor"
					vectorEffect="non-scaling-stroke"
				/>
				<circle cx="6.5" cy="13.5" r="1" stroke="currentColor" vectorEffect="non-scaling-stroke" />
				<circle cx="13.5" cy="13.5" r="1" stroke="currentColor" vectorEffect="non-scaling-stroke" />
				<path
					d="M14.5 11.5H6.28986C5.8268 11.5 5.42431 11.1821 5.31705 10.7316L3.18295 1.76838C3.07569 1.31791 2.6732 1 2.21014 1L0.5 1"
					stroke="currentColor"
					strokeLinecap="round"
					vectorEffect="non-scaling-stroke"
				/>
			</g>
		</svg>
	)
}
