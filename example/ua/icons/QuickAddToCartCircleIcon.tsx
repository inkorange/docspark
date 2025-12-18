import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function QuickAddToCartCircleIcon(props: IconProps) {
	return (
		<svg {...getEnhancedIconProps(props)} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="100%" height="100%" rx="16" fill="currentcolor" />
			<path
				d="M13.9098 12.7408C13.9096 12.1039 13.9091 11.5556 13.9092 10.7654C13.9094 9.38118 14.9772 8 16.6752 8C18.3733 8 19.4401 9.3889 19.4401 10.7654C19.4401 11.5556 19.4405 12.203 19.4405 12.7408"
				stroke="var(--color-white)"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d="M11.5381 14.519V13.7461C11.5381 13.1938 11.9858 12.7461 12.5381 12.7461H20.8098C21.362 12.7461 21.8098 13.1938 21.8098 13.7461V19.6455C21.8098 20.1978 21.362 20.6455 20.8098 20.6455H17.5195"
				stroke="var(--color-white)"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
			<path d="M11.6396 17.2842V24.0003" stroke="var(--color-white)" strokeLinecap="round" strokeLinejoin="round" />
			<path
				d="M14.8975 20.6426L8.18137 20.6426"
				stroke="var(--color-white)"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
