import styles from './HeartFilledIconAnimated.module.scss'
import { getEnhancedIconProps, type IconProps } from '../icons'

interface HeartFilledIconAnimatedProps extends IconProps {
	selected?: boolean
}

export default function HeartFilledIconAnimated(props: HeartFilledIconAnimatedProps) {
	return (
		<svg
			{...getEnhancedIconProps(props)}
			viewBox="0 0 40 40"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			aria-hidden
			className={styles.heart_filled_icon_animated}
			data-selected={props.selected !== undefined ? props.selected : undefined}
		>
			<path
				d="M20 13.561C19.116 12.453 17.425 11.672 15.929 11.672C12.851 11.672 10.708 13.735 10.708 16.312C10.708 21.121 20 29.768 20 29.768C20 29.768 29.292 21.121 29.292 16.312C29.292 13.735 27.149 11.672 24.071 11.672C22.575 11.672 20.884 12.453 20 13.561Z"
				vectorEffect="non-scaling-stroke"
			/>
			<path
				d="M20 13.561C19.116 12.453 17.425 11.672 15.929 11.672C12.851 11.672 10.708 13.735 10.708 16.312C10.708 21.121 20 29.768 20 29.768C20 29.768 29.292 21.121 29.292 16.312C29.292 13.735 27.149 11.672 24.071 11.672C22.575 11.672 20.884 12.453 20 13.561Z"
				vectorEffect="non-scaling-stroke"
			/>

			<circle strokeWidth="1.5" r="17" cx="20" cy="20" />
		</svg>
	)
}
