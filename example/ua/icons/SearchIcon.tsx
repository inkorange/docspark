import { getEnhancedIconProps, type IconProps } from './icons'

function SearchIcon(props: IconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			version="1.1"
			viewBox="0 0 16 16"
			{...getEnhancedIconProps(props)}
			fill="none"
		>
			<path
				fill="currentColor"
				d="M11.354 10.646a.5.5 0 0 0-.708.708l.708-.708zm3.292 4.708a.5.5 0 0 0 .708-.708l-.708.708zM11.5 7A4.5 4.5 0 0 1 7 11.5v1A5.5 5.5 0 0 0 12.5 7h-1zM7 2.5A4.5 4.5 0 0 1 11.5 7h1A5.5 5.5 0 0 0 7 1.5v1zM2.5 7A4.5 4.5 0 0 1 7 2.5v-1A5.5 5.5 0 0 0 1.5 7h1zM7 11.5A4.5 4.5 0 0 1 2.5 7h-1A5.5 5.5 0 0 0 7 12.5v-1zm3.646-.146 4 4 .708-.708-4-4-.708.708z"
			/>
		</svg>
	)
}

export default SearchIcon
