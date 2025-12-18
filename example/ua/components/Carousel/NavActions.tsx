'use client'

import styles from './Carousel.module.scss'
import React from 'react'
import ChevronRightIcon from '../../icons/ChevronRightIcon'
import { useComponentContext } from '../../providers/UIComponentsProvider'

export interface NavActionsProps {
	onNextClick: () => void
	onPrevClick: () => void
	nextDisabled: boolean
	prevDisabled: boolean
	showPagination: boolean
}

export const NavActions = ({
	onNextClick,
	onPrevClick,
	nextDisabled,
	prevDisabled,
	showPagination,
}: NavActionsProps) => {
	const { getLabelText } = useComponentContext()
	return (
		<span data-pagination={showPagination} className={`arrow-nav-actions ${styles['slider-nav']}`} slot="container-end">
			<button
				className={`${styles.actions} ${styles['actions--prev-arrow']}`}
				type="button"
				data-testid="prev-arrow"
				aria-disabled={prevDisabled}
				aria-label={getLabelText('Carousel', 'previous')}
				disabled={prevDisabled}
				onClick={onPrevClick}
				role="button"
			>
				<span className="visually-hidden">{getLabelText('Carousel', 'previous')}</span>
				<ChevronRightIcon size="SM" />
			</button>
			<button
				className={`${styles.actions} ${styles['actions--next-arrow']}`}
				type="button"
				data-testid="next-arrow"
				aria-disabled={nextDisabled}
				aria-label={getLabelText('Carousel', 'next')}
				disabled={nextDisabled}
				onClick={onNextClick}
				role="button"
			>
				<span className="visually-hidden">{getLabelText('Carousel', 'next')}</span>
				<ChevronRightIcon size="SM" />
			</button>
		</span>
	)
}
