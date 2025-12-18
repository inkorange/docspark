import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function PromoTagIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<g>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M2.5 5.72118C2.5 5.58031 2.55943 5.44598 2.66366 5.35121L8 0.5L13.3363 5.35121C13.4406 5.44598 13.5 5.58031 13.5 5.72118V15C13.5 15.2761 13.2761 15.5 13 15.5H3C2.72386 15.5 2.5 15.2761 2.5 15L2.5 5.72118Z"
					stroke="currentColor"
					strokeLinejoin="round"
					vectorEffect="non-scaling-stroke"
				/>
				<circle cx="8" cy="6" r="1.5" stroke="currentColor" vectorEffect="non-scaling-stroke" />
			</g>
		</svg>
	)
}
