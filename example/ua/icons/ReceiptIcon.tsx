import React from 'react'
import { getEnhancedIconProps, type IconProps } from './icons'

export const ReceiptIcon: React.FC<IconProps> = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 25" fill="none" role="img" {...getEnhancedIconProps(props)}>
			{props.title && <title>{props.title}</title>}
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3 23.9919C3 24.0452 5.35901 22.3867 6.11394 21.8545C6.25001 21.7586 6.43263 21.7654 6.56172 21.8705L8.93296 23.8014C9.06918 23.9124 9.26455 23.9125 9.40096 23.8018L11.7656 21.883C11.9021 21.7721 12.0977 21.7724 12.2339 21.8837L14.5837 23.8022C14.7192 23.9128 14.9136 23.9138 15.0501 23.8045L17.4666 21.8709C17.5979 21.7658 17.7826 21.7616 17.9182 21.8611C18.6677 22.4113 21 24.1137 21 23.9919C21 23.8575 21 4.26093 21 1.35774C21 1.15286 20.8339 1 20.629 1H3.37097C3.16609 1 3 1.15288 3 1.35776C3 4.2666 3 23.933 3 23.9919Z"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
			/>
			<rect x="15" y="15.5967" width="3" height="1.5" rx="0.741935" fill="currentColor" />
			<path
				d="M12.4146 15.5967H6.58535C6.26206 15.5967 6 15.9325 6 16.3467C6 16.7609 6.26206 17.0967 6.58535 17.0967H12.4146C12.7379 17.0967 13 16.7609 13 16.3467C13 15.9325 12.7379 15.5967 12.4146 15.5967Z"
				fill="currentColor"
			/>
			<rect x="15" y="11.145" width="3" height="1.5" rx="0.741935" fill="currentColor" />
			<path
				d="M12.4146 11.145H6.58535C6.26206 11.145 6 11.4808 6 11.895C6 12.3092 6.26206 12.645 6.58535 12.645H12.4146C12.7379 12.645 13 12.3092 13 11.895C13 11.4808 12.7379 11.145 12.4146 11.145Z"
				fill="currentColor"
			/>
			<path
				d="M12.4146 6.69336H6.58535C6.26206 6.69336 6 7.02913 6 7.44336C6 7.85758 6.26206 8.19336 6.58535 8.19336H12.4146C12.7379 8.19336 13 7.85758 13 7.44336C13 7.02913 12.7379 6.69336 12.4146 6.69336Z"
				fill="currentColor"
			/>
			<rect x="15" y="6.69336" width="3" height="1.5" rx="0.741935" fill="currentColor" />
		</svg>
	)
}

export default ReceiptIcon
