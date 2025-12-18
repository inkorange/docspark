import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function InstagramIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="currentColor" vectorEffect="non-scaling-stroke" />
			<circle cx="8" cy="8" r="3.5" stroke="currentColor" vectorEffect="non-scaling-stroke" />
			<circle cx="12" cy="4" r="1" fill="currentColor" />
		</svg>
	)
}
