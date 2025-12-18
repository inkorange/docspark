import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function FacebookIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<circle cx="8" cy="8" r="7.5" stroke="currentColor" vectorEffect="non-scaling-stroke" />
			<path
				d="M10.9194 10.168L11.252 8H9.17188V6.59375C9.17188 6.00063 9.4625 5.42188 10.3941 5.42188H11.3398V3.57617C11.3398 3.57617 10.4816 3.42969 9.66099 3.42969C7.94785 3.42969 6.82812 4.46797 6.82812 6.34766V8H4.92383V10.168H6.82812V15.4089C7.60465 15.5304 8.39535 15.5304 9.17188 15.4089V10.168H10.9194Z"
				fill="currentColor"
			/>
		</svg>
	)
}
