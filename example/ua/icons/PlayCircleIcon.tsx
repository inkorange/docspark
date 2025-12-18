import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function PlayCircleIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M12.765 22.1872C12.432 22.3954 12 22.156 12 21.7632L12 10.2342C12 9.84144 12.432 9.60202 12.765 9.81016L21.9883 15.5747C22.3016 15.7705 22.3016 16.2269 21.9883 16.4227L12.765 22.1872Z"
				fill="currentColor"
			/>
			<circle
				cx="16"
				cy="16"
				r="15"
				fill="currentColor"
				fillOpacity="0"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
