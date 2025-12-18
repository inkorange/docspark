/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './ProgressBar.module.scss'

import React, { type SVGProps } from 'react'

interface ProgressBarProps {
	step: number
	totalSteps: number
	className?: string
	svgProps?: SVGProps<SVGSVGElement>
}

export const ProgressBar = ({ step, totalSteps, className = '', svgProps }: ProgressBarProps) => {
	const width = ((step + 1) / totalSteps) * 100

	return (
		<div className={`${className} ${styles['progress-bar']}`}>
			<svg width="100%" height="8px" viewBox="0 0 500 8" aria-hidden {...svgProps}>
				<rect x="0" y="0" width="100%" height="100%" fill="var(--color-grey-3)" />
				<rect x="0" y="0" width={`${width}%`} height="100%" rx="4" fill="var(--color-green)" />
			</svg>
		</div>
	)
}
