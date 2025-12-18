import React from 'react'
import { getEnhancedIconProps, type IconProps } from './icons'

export const TruckWithLogoIcon: React.FC<IconProps> = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 25" fill="none" role="img" {...getEnhancedIconProps(props)}>
			{props.title && <title>{props.title}</title>}
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M29.522 20H33v-7.037l-4.87-2.111-1.252-5.63h-7.791V1H1v19"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12.826 20H22M1 20h4"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
			/>
			<path d="M19.087 5.174v14.609" stroke="currentColor" vectorEffect="non-scaling-stroke" />
			<circle
				cx="3.2"
				cy="3.2"
				r="3.2"
				transform="translate(22.635 16.86)"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
			/>
			<circle
				cx="3.2"
				cy="3.2"
				r="3.2"
				transform="translate(5.8 16.86)"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
			/>

			<path
				d="m11.382 9-.13.099c-.33.248-.81.418-1.432.418h-.041c-.623 0-1.102-.17-1.433-.418A9.608 9.608 0 0 1 8.216 9c.037-.028.08-.06.13-.1.33-.247.81-.418 1.433-.418h.04c.624 0 1.103.17 1.433.419.051.038.094.07.13.099M14.6 6.954s-.283-.23-1.18-.579C12.633 6.07 12.04 6 12.04 6l.002 1.801c0 .254-.066.485-.248.75-.669-.26-1.301-.418-1.992-.418-.691 0-1.324.159-1.992.417a1.243 1.243 0 0 1-.248-.749L7.565 6s-.598.068-1.385.375c-.897.35-1.18.58-1.18.58.037.817.712 1.544 1.774 2.045-1.063.5-1.738 1.226-1.774 2.046 0 0 .283.229 1.18.579.787.306 1.38.375 1.38.375l-.002-1.802c0-.253.066-.485.248-.748.668.258 1.3.417 1.992.417.69 0 1.323-.159 1.992-.417.183.262.247.495.247.748L12.035 12s.594-.068 1.38-.375c.897-.35 1.18-.58 1.18-.58-.036-.817-.71-1.544-1.773-2.045 1.063-.501 1.738-1.226 1.774-2.046"
				fill="currentColor"
			/>
		</svg>
	)
}

export default TruckWithLogoIcon
