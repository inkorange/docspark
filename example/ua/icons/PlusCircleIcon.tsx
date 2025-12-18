import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function PlusCircleIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<g>
				<circle cx="20" cy="20" r="20" fillOpacity="0.2" />
				<circle cx="20" cy="20" r="20" strokeWidth="0.0" stroke="currentColor" strokeOpacity="0.7" />
				<rect x="0" y="0" width="40" height="40" rx="20" fill="currentColor" />
				<path d="M20 14V26" stroke="var(--color-white)" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
				<path d="M14 20H26" stroke="var(--color-white)" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
			</g>
		</svg>
	)
}
