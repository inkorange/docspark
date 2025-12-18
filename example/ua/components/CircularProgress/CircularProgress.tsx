/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './CircularProgress.module.scss'
import React from 'react'

/**
 * CircularProgress component that indicates a "working" state, typically used inline, and not
 * as a full-screen overlay within our design system.
 */
export const CircularProgress = ({ size = 16 }: { size?: number }) => {
	const loaderSize = { '--loader-size': `${size}px` } as React.CSSProperties

	return (
		<div className={styles['circular-progress-wrapper']} style={loaderSize}>
			<svg viewBox={`20 20 40 40`}>
				<circle cx="40" cy="40" r="18" fill="none" strokeWidth="3" />
			</svg>
		</div>
	)
}
