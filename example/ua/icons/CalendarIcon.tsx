import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function CalendarIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<path
				d="M1 5H15V14.5C15 14.7761 14.7761 15 14.5 15H1.5C1.22386 15 1 14.7761 1 14.5V5Z"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7.76662 10.8181C7.76662 11.5621 7.30463 12.1021 6.22462 12.1021C5.00662 12.1021 4.64062 11.4721 4.64062 10.4641H5.46263C5.46263 10.9921 5.60663 11.3881 6.18263 11.3881C6.68663 11.3881 6.87263 11.1001 6.87263 10.7101C6.87263 10.2661 6.57862 10.0741 6.03262 10.0741H5.90663V9.48611H6.02663C6.57263 9.48611 6.80662 9.27011 6.80662 8.91611C6.80662 8.55611 6.62662 8.31611 6.18862 8.31611C5.70263 8.31611 5.52863 8.62211 5.52863 9.01811H4.70662C4.70662 8.14811 5.24062 7.66211 6.23662 7.66211C7.22062 7.66211 7.67062 8.17811 7.67062 8.83211C7.67062 9.25211 7.47263 9.60011 6.95662 9.76811C7.53863 9.91811 7.76662 10.2781 7.76662 10.8181ZM10.4126 7.76411V12.0001H9.55463V8.55011H8.63063L8.79862 7.76411H10.4126Z"
			/>
			<rect x="1" y="2" width="14" height="3" rx="0.5" stroke="currentColor" vectorEffect="non-scaling-stroke" />
			<path d="M5 1V3" stroke="currentColor" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
			<path d="M11 1V3" stroke="currentColor" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
		</svg>
	)
}
