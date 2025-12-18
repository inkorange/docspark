type RGB = `rgb(${number}, ${number}, ${number})`
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`
type HEX = `#${string}`
type CSSVAR = `var(--${string})`

/**
 * This will enforce the format of colors that can be used. We are trying to avoid someone dropping in a
 * native color like "black" or "red", and having it deviate from the permitted color palette. By not allowing
 * open-ended strings as acceptable colors for icons, we can catch any open-ended color.
 */
export type IconColor = RGB | RGBA | HEX | CSSVAR // TODO: We need to eventually lock down the colors that are permitted on icons.

export interface IconProps extends React.SVGProps<SVGSVGElement> {
	size?: IconSize
	color?: IconColor
	title?: string
	className?: string
	strokeWidth?: number
}

export type IconSize = 'XS' | 'SM' | 'MD' | 'LG' | 'XL' | 'XXL'

export const iconSizeMap: Record<IconSize, { width: number; height: number }> = {
	XS: { width: 12, height: 12 },
	SM: { width: 16, height: 16 },
	MD: { width: 24, height: 24 },
	LG: { width: 32, height: 32 },
	XL: { width: 40, height: 40 },
	XXL: { width: 48, height: 48 },
} as const

const strokeWidthMapping = {
	XS: 1,
	SM: 1.25,
	MD: 1.5,
	LG: 2,
	XL: 2.5,
	XXL: 3,
} as const

/**
 * Enhances the props passed to an icon by mapping the size property to width, height
 * properties.
 * @param props - The props being passed through by the component's caller
 * @returns
 */
export function getEnhancedIconProps(props: IconProps) {
	const { size = 'SM', color = 'currentColor', className, ...rest } = props

	const defaultProps = {
		role: 'img',
		'aria-hidden': true,
	}

	// 24x24 = 1.5px
	const strokeWidth = () => {
		const rootRatio = iconSizeMap[size].width > 16 ? 0.625 : 0.75
		return strokeWidthMapping[size] * rootRatio

		// const widthVal = strokeWidthMapping[size]
		// const viewPortRatio = iconSizeMap[size].width / viewPortSize
		// console.log('viewPortRatio', size, viewPortRatio)
		// return viewPortRatio
	}

	return {
		...defaultProps,
		...rest,
		...iconSizeMap[size],
		color,
		className,
		strokeWidth: strokeWidth(),
	}
}
