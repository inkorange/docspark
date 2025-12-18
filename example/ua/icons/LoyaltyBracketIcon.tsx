import type { IconProps } from './icons'
import { getEnhancedIconProps } from './icons'

export default function LoyaltyBracketIcon(props: IconProps) {
	const thickness = 20

	return (
		<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...getEnhancedIconProps(props)}>
			<path d={`M0,100 H100 l-${thickness},-${thickness} H${thickness} V${thickness} L0,0 Z`} fill="var(--color-red)" />
		</svg>
	)
}
