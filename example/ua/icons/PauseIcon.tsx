import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function PauseIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 32 32" fill="none" {...getEnhancedIconProps(props)} xmlns="http://www.w3.org/2000/svg">
			<path
				d="M10.3281 28.8125C9.59375 28.8125 9 28.25 9 27.5156V4.3125C9 3.57812 9.59375 3 10.3281 3C11.0781 3 11.6719 3.57812 11.6719 4.3125V27.5156C11.6719 28.25 11.0781 28.8125 10.3281 28.8125ZM20.6562 28.8125C19.9219 28.8125 19.3281 28.25 19.3281 27.5156V4.3125C19.3281 3.57812 19.9219 3 20.6562 3C21.3906 3 22 3.57812 22 4.3125V27.5156C22 28.25 21.3906 28.8125 20.6562 28.8125Z"
				fill="currentColor"
			/>
		</svg>
	)
}
