import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function PhoneFilledIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<path
				clipRule="evenodd"
				d="M4.18 2.093a.1.1 0 0 1 .152-.01L6.72 4.47a.75.75 0 0 1 0 1.06L5.53 6.72a.75.75 0 0 0 0 1.06l2.69 2.69a.75.75 0 0 0 1.06 0l1.19-1.19a.75.75 0 0 1 1.06 0l2.388 2.389a.1.1 0 0 1-.01.15l-2.872 2.154a.097.097 0 0 1-.08.018C10.532 13.899 7.108 13.108 5 11 2.897 8.897 2.008 5.657 1.9 5.24a.096.096 0 0 1 .017-.081l2.264-3.066z"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="currentColor"
			/>
		</svg>
	)
}
