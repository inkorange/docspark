import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function DropPinIcon(props: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" {...getEnhancedIconProps(props)}>
			<path
				d="M17.1302 12.5709L17.1214 12.5835L17.1131 12.5965L12.0003 20.6061L6.88685 12.5964L6.8786 12.5835L6.86983 12.5709C6.1639 11.5589 5.75 10.3289 5.75 9C5.75 5.54822 8.54822 2.75 12 2.75C15.4518 2.75 18.25 5.54822 18.25 9C18.25 10.3289 17.8361 11.5589 17.1302 12.5709Z"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d="M10.4527 7.4527L12 6.81179L13.5473 7.4527L14.1882 9L13.5473 10.5473L12 11.1882L10.4527 10.5473L9.81179 9L10.4527 7.4527Z"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
