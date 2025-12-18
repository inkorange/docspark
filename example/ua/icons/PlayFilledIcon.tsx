import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function PlayFilledIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 22 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<path
				d="M1.16 30.88C1.09408 30.9294 1 30.8824 1 30.8L1 1.2C1 1.1176 1.09408 1.07056 1.16 1.12L20.8933 15.92C20.9467 15.96 20.9467 16.04 20.8933 16.08L1.16 30.88Z"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="currentColor"
			/>
		</svg>
	)
}
