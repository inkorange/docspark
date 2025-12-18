import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function CameraIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 32 32" fill="none" {...getEnhancedIconProps(props)} xmlns="http://www.w3.org/2000/svg">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M16.0008 8.85156H2.93333C2.41787 8.85156 2 9.26943 2 9.7849V26.5849C2 27.1004 2.41787 27.5182 2.93333 27.5182H29.0667C29.5821 27.5182 30 27.1004 30 26.5849V9.78489C30 9.26943 29.5821 8.85156 29.0667 8.85156H16.0008Z"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M9.46875 8.66667L11.5685 4.51232C11.7273 4.19811 12.0494 4 12.4014 4H19.6027C19.9548 4 20.2769 4.19811 20.4357 4.51232L22.5354 8.66667H9.46875Z"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
				strokeLinejoin="round"
			/>
			<circle cx="16.0063" cy="17.9999" r="5.6" stroke="currentColor" vectorEffect="non-scaling-stroke" />
			<path
				d="M23.7 11.1851C23.3136 11.1851 23 11.4987 23 11.8851C23 12.2715 23.3136 12.5851 23.7 12.5851C24.0864 12.5851 24.4 12.2715 24.4 11.8851C24.4 11.4987 24.0864 11.1851 23.7 11.1851Z"
				fill="currentColor"
			/>
			<path
				d="M27.0781 11.1851H25.9115C25.5893 11.1851 25.3281 11.4984 25.3281 11.8851C25.3281 12.2717 25.5893 12.5851 25.9115 12.5851H27.0781C27.4002 12.5851 27.6615 12.2717 27.6615 11.8851C27.6615 11.4984 27.4002 11.1851 27.0781 11.1851Z"
				fill="currentColor"
			/>
			<path
				d="M14.1406 6.33337H17.874"
				stroke="currentColor"
				strokeLinecap="square"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
