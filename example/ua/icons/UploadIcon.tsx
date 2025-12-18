import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function UploadIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" {...getEnhancedIconProps(props)} xmlns="http://www.w3.org/2000/svg">
			<path
				d="M14.6602 11.1612V14.4094L1.44683 14.4043C1.40942 14.4043 1.37911 14.3739 1.37911 14.3365V11.1612"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d="M7.99924 1.45168L7.99924 10.9355"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d="M4.38672 4.6129L7.95172 1.0479C7.97818 1.02145 8.02107 1.02145 8.04752 1.0479L11.6125 4.6129"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
