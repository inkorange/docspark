import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function LockOpenIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<rect
				x="1"
				y="6"
				width="14"
				height="9"
				rx="1"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M11.0288 2.37924C10.8908 2.22084 10.7418 2.07608 10.5844 1.94497C10.4099 1.79971 10.2249 1.67119 10.0328 1.55943C9.39176 1.18648 8.67089 1 7.99284 1C6.41375 1 4.62086 2.00071 4.12076 4.00214C3.95454 4.66738 3.95454 5.33333 4.12076 6"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
				strokeLinecap="round"
			/>
			<circle cx="8" cy="9.75" r="1.75" stroke="currentColor" vectorEffect="non-scaling-stroke" />
			<path
				d="M8 12V13.25"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
