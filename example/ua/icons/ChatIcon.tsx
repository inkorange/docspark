import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function ChatIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<g fill="none" fillRule="evenodd">
				<path
					vectorEffect="non-scaling-stroke"
					d="M42 6a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H21l-6.44 6.44a1.5 1.5 0 0 1-.912.431l-.148.008a1.5 1.5 0 0 1-1.5-1.5V36H6a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h36z"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
		</svg>
	)
}
