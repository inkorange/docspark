import { getEnhancedIconProps } from './icons'
import type { IconProps } from './icons'

export default function AlertCircleIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<circle vectorEffect="non-scaling-stroke" cx="50%" cy="50%" r="22.5" stroke="currentcolor" />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M22.5 13.5L25.5 13.5V27.9375H22.5L22.5 13.5Z"
				fill="currentcolor"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M22.5 30.181L25.5 30.181V34.0386H22.5L22.5 30.181Z"
				fill="currentcolor"
			/>
		</svg>
	)
}
