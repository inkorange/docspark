import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function ReturnIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 32 30" fill="none" {...getEnhancedIconProps(props)} xmlns="http://www.w3.org/2000/svg">
			<path
				d="M6.87551 27.5L1.52126 22.1458C1.44083 22.0652 1.44083 21.9348 1.52126 21.8542L6.87551 16.5"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M31 22H1.375"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M25.1245 2.5L30.4787 7.85425C30.5592 7.93477 30.5592 8.06523 30.4787 8.14575L25.1245 13.5"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M1 8H30.625"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
