import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function AlertIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" {...getEnhancedIconProps(props)} xmlns="http://www.w3.org/2000/svg">
			<path vectorEffect="non-scaling-stroke" d="M1 1L15 15" stroke="currentColor" strokeLinecap="round" />
			<path vectorEffect="non-scaling-stroke" d="M1 15L15 1" stroke="currentColor" strokeLinecap="round" />
		</svg>
	)
}
