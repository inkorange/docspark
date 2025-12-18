import React from 'react'
import { getEnhancedIconProps, type IconProps } from './icons'

export const CreditCardIcon: React.FC<IconProps> = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 19" fill="none" role="img" {...getEnhancedIconProps(props)}>
			{props.title && <title>{props.title}</title>}
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M1.5 17H22.5V7.53H1.5V17ZM1.5 6.03H22.5V2H1.5v4.03ZM24 17.5v0l-.005.102a.896.896 0 0 1-.492.595L23 18.5H1l-.103-.005a.896.896 0 0 1-.595-.492L0 17.5V1.5C0 .982.393.556.897.505L1 .5h22l.103.005c.504.051.897.477.897.995v16ZM6.103 12.743 6 12.738H4a.738.738 0 1 0 0 1.476h2l.103-.005a.738.738 0 0 0 0-1.466ZM11.332 12.738l.103.005a.738.738 0 0 1 0 1.466l-.103.005H9.332a.738.738 0 1 1 0-1.476h2ZM16.76 12.743 16.658 12.738h-2a.738.738 0 1 0 0 1.476h2l.103-.005a.738.738 0 0 0 0-1.466Z"
				fill="currentColor"
			/>
		</svg>
	)
}

export default CreditCardIcon
