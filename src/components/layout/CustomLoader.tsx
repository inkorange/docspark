'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './CustomLoader.module.scss'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { LoadingDots } from '../LoadingDots/LoadingDots'

export interface CustomerLoaderProps {
	animate?: boolean
	onClick?: (e: React.MouseEvent) => void
	loaderContainer?: string
	delay?: boolean
	show?: boolean
}

export const CustomLoader = ({
	animate = true,
	onClick,
	loaderContainer = 'custom-loader',
	delay = true,
	show = true,
}: CustomerLoaderProps) => {
	const [portalDestination, setPortalDestination] = useState<HTMLElement | null>(null)

	useEffect(() => {
		setPortalDestination(document.getElementById(loaderContainer))
	}, [loaderContainer])

	if (!portalDestination) {
		return null
	}

	const contents = (
		<div
			data-testid="custom-loader"
			className={`
				${styles['loader-base']}
			 	${delay ? styles['show-intent'] : ''}
			 	${show ? styles['loader-base--show'] : ''}
			`}
			onClick={onClick}
		>
			<div className={styles.curtain} />
			{animate && (
				<div data-testid="animated-loader" role="alert" aria-busy={show} className={styles.container}>
					<LoadingDots shape="circle" />
				</div>
			)}
		</div>
	)

	return createPortal(contents, portalDestination)
}
