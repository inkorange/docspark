import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function HeartIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M8 3.19935C7.3 2.17974 6.1625 1.5 4.85 1.5C2.75 1.5 1 3.19935 1 5.23856C1 8.97712 8 14.5 8 14.5C8 14.5 15 8.97712 15 5.23856C15 3.19935 13.25 1.5 11.15 1.5C9.8375 1.5 8.7 2.17974 8 3.19935Z"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
