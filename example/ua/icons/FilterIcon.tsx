import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function FilterIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<g id="UA_Icons_filter-light-interface-small-outlined 1">
				<path
					id="Vector"
					fillRule="evenodd"
					clipRule="evenodd"
					d="M13.1157 4.00586H16.8657L18.3076 6.50332H20.9979V8.00332H18.3078L16.8657 10.5011H13.1157L11.6737 8.00332H3V6.50332H11.6738L13.1157 4.00586ZM12.9728 7.25346L13.9817 5.50586H15.9997L17.0087 7.25346L15.9997 9.00106H13.9817L12.9728 7.25346Z"
					fill="currentColor"
				/>
				<path
					id="Vector_2"
					fillRule="evenodd"
					clipRule="evenodd"
					d="M7.44678 13.5039H11.1968L12.6388 16.0015H20.9979V17.5015H12.6388L11.1968 19.9991H7.44678L6.00478 17.5015H3V16.0015H6.0048L7.44678 13.5039ZM7.30383 16.7515L8.3128 15.0039H10.3308L11.3397 16.7515L10.3308 18.4991H8.3128L7.30383 16.7515Z"
					fill="currentColor"
				/>
			</g>
		</svg>
	)
}
