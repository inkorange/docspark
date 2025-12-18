import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function QuestionCircleIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<circle
				cx="50%"
				cy="50%"
				r="7.25"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M8.592 10.301V11.534H7.539V10.301H8.592ZM7.566 9.419C7.566 9.257 7.5885 9.1085 7.6335 8.9735C7.6785 8.8385 7.7385 8.7155 7.8135 8.6045C7.8885 8.4935 7.9725 8.387 8.0655 8.285C8.1585 8.183 8.256 8.081 8.358 7.979L8.619 7.718C8.739 7.598 8.841 7.466 8.925 7.322C9.009 7.178 9.051 6.995 9.051 6.773C9.051 6.485 8.9715 6.2615 8.8125 6.1025C8.6535 5.9435 8.43 5.864 8.142 5.864C7.788 5.864 7.521 5.9435 7.341 6.1025C7.161 6.2615 7.029 6.521 6.945 6.881L6 6.755C6.042 6.521 6.114 6.2975 6.216 6.0845C6.318 5.8715 6.4545 5.684 6.6255 5.522C6.7965 5.36 7.0065 5.2325 7.2555 5.1395C7.5045 5.0465 7.803 5 8.151 5C8.775 5 9.258 5.1515 9.6 5.4545C9.942 5.7575 10.113 6.155 10.113 6.647C10.113 6.935 10.0695 7.178 9.9825 7.376C9.8955 7.574 9.789 7.742 9.663 7.88L9.114 8.429C8.958 8.585 8.829 8.744 8.727 8.906C8.625 9.068 8.574 9.254 8.574 9.464V9.599H7.566V9.419Z"
				fill="currentColor"
			/>
		</svg>
	)
}
