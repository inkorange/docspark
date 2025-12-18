import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function OrderHistoryIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M1.78571 0.823529H11.2143V3H12V0H1V14H4.14286V13.1765H1.78571V0.823529Z"
				fill="currentColor"
			/>
			<rect x="6" y="12" width="7" height="1" fill="currentColor" />
			<rect x="6" y="9" width="7" height="1" fill="currentColor" />
			<rect x="6" y="6" width="7" height="1" fill="currentColor" />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M4.78571 3.76471V15.2353H14.2143V3.76471H4.78571ZM4 3H15V16H4V3Z"
				fill="currentColor"
			/>
		</svg>
	)
}
