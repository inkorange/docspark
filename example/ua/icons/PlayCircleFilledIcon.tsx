import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function PlayCircleFilledIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 32 32" fill="none" {...getEnhancedIconProps(props)} xmlns="http://www.w3.org/2000/svg">
			<circle cx="16" cy="16" r="16" fill="currentColor" />
			<rect width="16" height="16" transform="translate(9 8)" fill="currentColor" />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M12.1573 22.8899C12.0911 22.9363 12 22.8888 12 22.8079L12 9.19207C12 9.11116 12.0911 9.06375 12.1573 9.11014L21.883 15.9181C21.9398 15.9579 21.9398 16.0421 21.883 16.0819L12.1573 22.8899Z"
				stroke="var(--color-white)"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
