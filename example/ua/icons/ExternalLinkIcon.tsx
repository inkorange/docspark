import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function ExternalLinkIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<path
				d="M8.63243 2.0895C10.1107 1.10671 11.8611 1.10671 13.0963 2.29959C13.7396 2.92077 14.2212 3.87468 14.3164 4.66293C14.4859 6.06541 13.4932 7.43958 12.2652 8.71125C10.347 10.6977 8.23838 12.4882 6.07916 10.0988"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d="M7.6039 13.8597C6.12561 14.8425 4.37527 14.8425 3.14001 13.6496C2.49675 13.0284 2.01512 12.0745 1.91988 11.2863C1.75044 9.88381 2.74309 8.50964 3.97113 7.23797C5.88937 5.25156 7.99795 3.461 10.1572 5.85046"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
