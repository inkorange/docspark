import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function ArrowDropDownIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0 0.5H12L6 7.5L0 0.5Z"
				fill="currentColor"
				transform="translate(2, 4)"
			/>
		</svg>
	)
}
