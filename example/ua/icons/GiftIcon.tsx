import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function GiftIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<path
				d="M9.5 7H13.5C13.7761 7 14 7.21069 14 7.47059V14.5294C14 14.7893 13.7761 15 13.5 15H2.5C2.22386 15 2 14.7893 2 14.5294V7.47059C2 7.21069 2.22386 7 2.5 7H6.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d="M2.5 7H1.5C1.22386 7 1 6.77614 1 6.5V4C1 3.72386 1.22386 3.5 1.5 3.5H14.5C14.7761 3.5 15 3.72386 15 4V6.5C15 6.77614 14.7761 7 14.5 7H13.5"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d="M6.5 3.5V15.1"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d="M9.55 3.5V15.1"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d="M8.5 3.5H11.3333C11.955 3.5 12.5 2.96362 12.5 2.25C12.5 1.85827 12.3875 1.54759 12.2074 1.34227C12.0356 1.14639 11.7625 1 11.3333 1C11.2003 1 10.9534 1.08188 10.601 1.29333C10.2683 1.49294 9.90906 1.76605 9.5716 2.04952C9.23615 2.33129 8.93273 2.61439 8.71257 2.82778C8.6281 2.90965 8.55627 2.98089 8.5 3.0374V3.5Z"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d="M7.5 3.5H4.66667C4.04504 3.5 3.5 2.96362 3.5 2.25C3.5 1.85827 3.61246 1.54759 3.79256 1.34227C3.96437 1.14639 4.23747 1 4.66667 1C4.79968 1 5.04658 1.08188 5.399 1.29333C5.73168 1.49294 6.09094 1.76605 6.4284 2.04952C6.76385 2.33129 7.06727 2.61439 7.28743 2.82778C7.3719 2.90965 7.44373 2.98089 7.5 3.0374V3.5Z"
				stroke="currentColor"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}
