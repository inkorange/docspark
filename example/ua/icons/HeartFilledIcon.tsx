import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function HeartFilledIcon(props: IconProps) {
	return (
		<svg
			{...getEnhancedIconProps(props)}
			viewBox="0 0 40 40"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			aria-hidden
		>
			<path
				d="M20 6.61251C18.1 3.845 15.0125 2 11.45 2C5.75 2 1 6.61251 1 12.1475C1 22.2951 20 37.2857 20 37.2857C20 37.2857 39 22.2951 39 12.1475C39 6.61251 34.25 2 28.55 2C24.9875 2 21.9 3.845 20 6.61251Z"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d="M20 6.61251C18.1 3.845 15.0125 2 11.45 2C5.75 2 1 6.61251 1 12.1475C1 22.2951 20 37.2857 20 37.2857C20 37.2857 39 22.2951 39 12.1475C39 6.61251 34.25 2 28.55 2C24.9875 2 21.9 3.845 20 6.61251Z"
				fill="currentColor"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
