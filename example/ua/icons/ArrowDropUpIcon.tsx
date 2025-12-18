import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function ArrowDropUpIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0 7.5L6 0.5L12 7.5H0Z"
				fill="currentColor"
				transform="translate(2, 4)"
			/>
		</svg>
	)
}
