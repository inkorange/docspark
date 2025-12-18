import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function PersonIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<circle cx="8" cy="5" r="3.5" stroke="currentColor" vectorEffect="non-scaling-stroke" />
			<path
				d="M15.319 14.942c.049.21.086.4.112.558H.607a9.248 9.248 0 0 1 1.037-3.005C2.623 10.75 4.461 9 8 9c3.54 0 5.389 1.75 6.378 3.496.502.885.784 1.774.94 2.446z"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
