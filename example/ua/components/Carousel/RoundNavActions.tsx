'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './RoundNavActions.module.scss'

import React from 'react'
import ChevronRightIcon from '../../icons/ChevronRightIcon'
import type { NavActionsProps } from './NavActions'
import { useComponentContext } from '../../providers/UIComponentsProvider'

export const RoundNavActions = ({
	onNextClick,
	onPrevClick,
	nextDisabled,
	prevDisabled,
	showPagination,
}: NavActionsProps) => {
	const { getLabelText } = useComponentContext()
	return (
		<span data-pagination={showPagination} className={`round-nav-actions ${styles['slider-nav']}`} slot="container-end">
			<button type="button" onClick={onPrevClick} disabled={prevDisabled}>
				<span className="visually-hidden">{getLabelText('Carousel', 'previous')}</span>
				<ChevronRightIcon size="SM" />
			</button>
			<button type="button" onClick={onNextClick} disabled={nextDisabled}>
				<span className="visually-hidden">{getLabelText('Carousel', 'next')}</span>
				<ChevronRightIcon size="SM" />
			</button>
		</span>
	)
}
