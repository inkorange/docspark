import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function BellIcon(props: IconProps) {
	return (
		<svg
			width="16"
			height="21"
			viewBox="0 0 16 21"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...getEnhancedIconProps(props)}
		>
			<path
				d="M0 17.5V15.5H2V8.5C2 7.11667 2.41667 5.8875 3.25 4.8125C4.08333 3.7375 5.16667 3.03333 6.5 2.7V2C6.5 1.58333 6.64583 1.22917 6.9375 0.9375C7.22917 0.645833 7.58333 0.5 8 0.5C8.41667 0.5 8.77083 0.645833 9.0625 0.9375C9.35417 1.22917 9.5 1.58333 9.5 2V2.7C10.8333 3.03333 11.9167 3.7375 12.75 4.8125C13.5833 5.8875 14 7.11667 14 8.5V15.5H16V17.5H0ZM8 20.5C7.45 20.5 6.97917 20.3042 6.5875 19.9125C6.19583 19.5208 6 19.05 6 18.5H10C10 19.05 9.80417 19.5208 9.4125 19.9125C9.02083 20.3042 8.55 20.5 8 20.5Z"
				fill="currentColor"
			/>
		</svg>
	)
}
