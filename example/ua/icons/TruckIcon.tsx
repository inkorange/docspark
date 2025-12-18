import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function TruckIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			{props.title && <title>{props.title}</title>}
			<path
				d="M20.5953 17.6666C20.5953 18.9647 19.5662 19.9999 18.3176 19.9999C17.0691 19.9999 16.04 18.9647 16.04 17.6666C16.04 16.3685 17.0691 15.3333 18.3176 15.3333C19.5662 15.3333 20.5953 16.3685 20.5953 17.6666Z"
				stroke="currentColor"
				strokeLinecap="round"
				vectorEffect="non-scaling-stroke"
			/>
			<ellipse cx="18.3205" cy="17.5999" rx="0.743304" ry="0.75" fill="currentColor" />
			<path
				d="M8.62358 17.6666C8.62358 18.9647 7.59454 19.9999 6.34597 19.9999C5.0974 19.9999 4.06836 18.9647 4.06836 17.6666C4.06836 16.3685 5.0974 15.3333 6.34597 15.3333C7.59454 15.3333 8.62358 16.3685 8.62358 17.6666Z"
				stroke="currentColor"
				strokeLinecap="round"
				vectorEffect="non-scaling-stroke"
			/>
			<ellipse cx="6.35268" cy="17.6001" rx="0.743304" ry="0.75" fill="currentColor" />
			<path
				d="M0.604492 17.5H4.07324"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d="M20.9215 17.5H23.3991V12.5L19.9304 11L19.0632 7H13.984V4L0.604492 4V17.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d="M9.0293 17.5H15.4713"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d="M13.9821 7V17.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
