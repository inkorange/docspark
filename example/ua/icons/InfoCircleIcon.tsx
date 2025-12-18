import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function InfoCircleIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<circle
				cx="50%"
				cy="50%"
				r="7.25"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
			<path fillRule="evenodd" clipRule="evenodd" d="M7.5 6.5L8.5 6.5V12H7.5L7.5 6.5Z" fill="currentColor" />
			<path fillRule="evenodd" clipRule="evenodd" d="M7.5 4L8.5 4V5H7.5L7.5 4Z" fill="currentColor" />
		</svg>
	)
}
