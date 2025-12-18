import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function StarFilledIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<path
				d="M18.0018 2L22.0434 14.4372L35.1208 14.4377L24.5413 22.1248L28.582 34.5623L18.0018 26.876L7.42169 34.5623L11.4624 22.1248L0.882812 14.4377L13.9602 14.4372L18.0018 2Z"
				fill="currentColor"
			/>
		</svg>
	)
}
