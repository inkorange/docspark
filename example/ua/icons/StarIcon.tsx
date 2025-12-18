import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function StarIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M8 11.417L3.70301 14.4792C3.69381 14.4857 3.68159 14.4767 3.68518 14.4659L5.34 9.53008L1.03013 6.48683C1.02082 6.48026 1.02549 6.46561 1.03689 6.46564L6.35603 6.47699L7.98892 1.53354C7.99245 1.52286 8.00755 1.52286 8.01108 1.53354L9.64397 6.47699L14.9631 6.46564C14.9745 6.46561 14.9792 6.48026 14.9699 6.48683L10.66 9.53008L12.3148 14.4659C12.3184 14.4767 12.3062 14.4857 12.297 14.4792L8 11.417Z"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
