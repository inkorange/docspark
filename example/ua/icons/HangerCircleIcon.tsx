import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function HangerCircleIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<rect width="40" height="40" rx="20" fill="currentColor" />
			<path
				d="M18.6655 20L12.0051 26.6561C11.9992 26.6619 11.9992 26.6714 12.0051 26.6773L13.3243 27.9956C13.3271 27.9984 13.3309 28 13.3349 28H26.6644C26.6684 28 26.6722 27.9984 26.675 27.9956L27.995 26.6765C28.0005 26.6709 28.0009 26.6621 27.9958 26.6561L20.1959 17.5621C20.0979 17.4479 20.1356 17.2703 20.2693 17.2014C20.9471 16.8523 22.668 15.8494 22.668 14.6667C22.668 13.1939 21.4734 12 19.9997 12C18.5259 12 17.3313 13.1939 17.3313 14.6667"
				stroke="var(--color-white)"
				vectorEffect="non-scaling-stroke"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
