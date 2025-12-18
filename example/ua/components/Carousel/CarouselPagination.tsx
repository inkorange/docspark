import { useMemo } from 'react'
import styles from './CarouselPagination.module.scss'
import { type Maybe } from './CarouselHandler'

interface CarouselPaginationProps {
	onClick: (index: number) => void
	displayItems?: number
	slideCount: number
	step: 'page' | 'single'
	itemContainer: Maybe<HTMLDivElement>
	activeIndex: number
}
export const CarouselPagination = ({
	step,
	itemContainer,
	displayItems,
	slideCount,
	onClick,
	activeIndex,
}: CarouselPaginationProps) => {
	const slideDotCount = useMemo(() => {
		switch (step) {
			case 'page':
				return displayItems ? Math.ceil(slideCount / displayItems) : slideCount
			default:
				return slideCount - displayItems + 1
		}
	}, [displayItems, slideCount, step])

	const activeIndexCalculation = useMemo(() => {
		const pageWidth = (itemContainer?.offsetWidth ?? 0) * slideDotCount
		const scrollPos = itemContainer?.scrollLeft ?? 0
		const indexCalc = Math.round((scrollPos / pageWidth) * slideDotCount)
		return Number.isNaN(indexCalc) ? 0 : indexCalc
	}, [itemContainer?.offsetWidth, itemContainer?.scrollLeft, slideDotCount])

	const activeIndexLocal = step === 'page' ? activeIndexCalculation : activeIndex

	return (
		<div className={`carousel-pagination ${styles['carousel-pagination']}`}>
			{new Array(slideDotCount).fill(null).map((post, index: number) => (
				<button
					type={'button'}
					key={index}
					aria-current={index === activeIndexLocal}
					aria-label={`Slide ${index + 1} of ${slideDotCount}`}
					onClick={() => onClick(index)}
				>
					<span className={`${styles['grid-indicator']} ${activeIndexLocal === index ? styles['active-grid'] : ''}`} />
				</button>
			))}
		</div>
	)
}
