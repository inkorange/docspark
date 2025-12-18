import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function PlusIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" {...getEnhancedIconProps(props)} xmlns="http://www.w3.org/2000/svg">
			<path vectorEffect="non-scaling-stroke" d="M8 1V15" stroke="currentColor" strokeLinecap="round" />
			<path vectorEffect="non-scaling-stroke" d="M15 8L1 8" stroke="currentColor" strokeLinecap="round" />
		</svg>
	)
}
