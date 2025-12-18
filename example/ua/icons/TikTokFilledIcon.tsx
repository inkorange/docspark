import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

function TikTokFilledIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<path
				d="M10.8814 0H8.18488V10.8985C8.18488 12.1971 7.1478 13.2638 5.85718 13.2638C4.56656 13.2638 3.52947 12.1971 3.52947 10.8985C3.52947 9.6232 4.54352 8.57969 5.78806 8.53333V5.79711C3.04549 5.84347 0.833008 8.09276 0.833008 10.8985C0.833008 13.7276 3.09158 16 5.88024 16C8.66886 16 10.9274 13.7044 10.9274 10.8985V5.31013C11.9415 6.05218 13.186 6.49276 14.4997 6.51596V3.77971C12.4716 3.71015 10.8814 2.04058 10.8814 0Z"
				fill="currentColor"
			/>
		</svg>
	)
}

export default TikTokFilledIcon
