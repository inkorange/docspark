import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function MenuIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<path d="M0.5 3H15.5" stroke="currentColor" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
			<path d="M0.5 8H15.5" stroke="currentColor" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
			<path d="M0.5 13H15.5" stroke="currentColor" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
		</svg>
	)
}
