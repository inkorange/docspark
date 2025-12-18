'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './Carousel.module.scss'

import React, {
	memo,
	useRef,
	useState,
	useEffect,
	useMemo,
	useCallback,
	Children,
	cloneElement,
	useImperativeHandle,
	type ReactElement,
	type Ref,
} from 'react'
import { RoundNavActions } from './RoundNavActions'
import { NavActions, type NavActionsProps } from './NavActions'
import { useDebouncedCallback } from '../hooks/useDebouncedCallback'
import { CarouselPagination } from './CarouselPagination'
import { CarouselHandler } from './CarouselHandler'
import useWindowDimensions from '../hooks/useWindowDimensions' // TODO: Need local helpers
import { useOnScreen } from '../hooks/useOnScreen' // TODO: Need Local Helpers

export type SwipeInteractionType = 'flick' | 'slide'

export type BreakpointOptions = {
	displayItems?: number
	spaceBetween?: number
	fullbleed?: boolean
	swipeInteraction?: SwipeInteractionType
}

export interface CarouselProps extends React.PropsWithChildren {
	/** When there is a resize event, this object is interpreted to see if there is a displayItems change based on the screen width.
	 * Configs that can be set based on screen resolution:
	 * 1. displayItems
	 * 2. spaceBetween
	 * 3. fullBleed
	 * 4. swipeInteraction
	 *
	 * Example:
	 *
	 * ```
	 * {
	 *		580: { // notes the screen width
	 * 		displayItems: 6,
	 * 		swipeInteraction: 'flick',
	 *		},
	 *		1024: {
	 * 		displayItems: 10,
	 *		},
	 * }
	 * ```
	 * */
	breakpoints?: Record<number, BreakpointOptions>
	children: ReactElement<CarouselItemProps> | Array<ReactElement<CarouselItemProps>>
	/** Additional class styling for the component based on it's placement */
	className?: string
	/** the number of items to display in the panel, used to calculate the slide logic */
	displayItems?: number
	/** Will disregard the padding on the sides of the carousel */
	fullbleed?: boolean
	/** Static height for the container, which could also affect the sizes of the items in the carousel */
	height?: number | string
	/** When set, the slider will automatically move to this index item in the carousel when the component first mounts. */
	initialItem?: number
	/** The scroll behavior for the initial item, defaults to smooth */
	initialItemScrollBehavior?: ScrollBehavior
	/** Callback event fired when the carousel reaches the end of the slider */
	onCarouselEnd?: () => void
	/** Callback event fired when the page changes on the slider */
	onIndexChange?: (index: number, state?: CarouselState) => void
	/** This will determine if we present the arrows on the carousel, user can still swipe them to go to the next/prev pages */
	showNavigation?: boolean
	/** Toggle to present the dot menu below the carousel items that indicates the slide position */
	showPagination?: boolean
	/** Defines the gap between carousel items, this can be conditionally changed via the breakpoint prop */
	spaceBetween?: number
	/** This will tell how far the slider will move when the nav buttons are clicked, either one by one, or a full page slide */
	step?: 'page' | 'single'
	/** By default the arrows for navigation are inserted as simple arrow icons, this flag presents the
	 * nav arrows as rounded icon buttons, which are positioned relative to the parent container. */
	useRoundNav?: boolean
	/** Value determines the user interaction style for swiping, by default the value is `slide` which will slide the panel
	 * at a minimum a half width of a tile, resulting in longer swipes. `swipe` config allows the user to quickly flick the
	 * carousel to advance to the next slide (better for mobile). This is also a breakpoint configuration. */
	swipeInteraction?: SwipeInteractionType
	/** Debounce time for the scroll event, defaults to 50ms */
	scrollDebounce?: number
}

export interface CarouselActions {
	slideTo: (index: number | undefined, behavior?: ScrollBehavior | undefined) => void
}

export interface CarouselState {
	/** Set to true if carousel on most "right" or "bottom" position */
	isEnd: boolean
}

export const DEFAULT_CONTAINER_WIDTH = 300

/**
 * The `Carousel` component is an element that allows a collection of children to be swiped through via user
 * interactions, be it touch/mouse inputs, or direct click on navigational controls. The component is highly
 * customizable to adapt to different views (via `breakpoints` configurations). Many of the controls emulate the
 * same options in the `Swiper` library for easier migration to this more light-weight implementation.
 *
 * Usage where a parent `Carousel` element needs to contain a collection of `CarouselItem` components:
 * ```
 * <Carousel displayItems={5}>
 * 	<CarouselItem>
 * 		Panel Content 1
 * 	</CarouselItem>
 * 	<CarouselItem>
 * 		Panel Content 2
 * 	</CarouselItem>
 * 	...
 * </Carousel>
 * ```
 */
export const Carousel = memo(
	React.forwardRef<CarouselActions, CarouselProps>(function Carousel(
		{
			initialItem,
			initialItemScrollBehavior = 'smooth',
			step = 'page',
			breakpoints,
			fullbleed = false,
			useRoundNav = false,
			showNavigation = true,
			className,
			height,
			displayItems,
			onCarouselEnd,
			onIndexChange,
			showPagination = false,
			spaceBetween,
			swipeInteraction = 'slide',
			children,
			scrollDebounce = 50,
		}: CarouselProps,
		ref: Ref<CarouselActions> | undefined,
	): React.JSX.Element {
		const carouselContainerRef = useRef<HTMLElement>({} as HTMLElement)
		const carouselItemsRef = useRef<HTMLDivElement>(null)
		const [activeIndex, setActiveIndex] = useState(0)
		const [prevDisabled, setPrevDisabled] = useState<boolean>(true)
		const [nextDisabled, setNextDisabled] = useState<boolean>(true)
		const [navigationDisabled, setNavigationDisabled] = useState<boolean>(true)
		const [currentDisplayItems, setCurrentDisplayItems] = useState<number | undefined>(displayItems)
		const [currentFullbleed, setCurrentFullbleed] = useState<boolean>(fullbleed)
		const [currentSwipeInteraction, setCurrentSwipeInteraction] = useState<SwipeInteractionType>(swipeInteraction)
		const initialPositionFired = useRef<boolean>(false)
		const mountInterval = useRef<NodeJS.Timeout | undefined>(undefined)
		const carouselHandler = useRef(new CarouselHandler()).current
		const slideCount = useMemo(() => Children.count(children), [children])
		const { width } = useWindowDimensions()

		useImperativeHandle(ref, () => ({
			slideTo,
		}))

		/** initiate and create a local reference for the Carousel DOM */
		useEffect(() => {
			carouselHandler.resolveObjectDimensions(carouselContainerRef.current, carouselItemsRef.current)
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [])

		function slideTo(index: number | undefined, behavior: ScrollBehavior | undefined = 'smooth') {
			if (index === undefined) return
			if (carouselHandler.carouselItems?.length) {
				/**
				 * This setTimeout waits one render cycle to ensure that a concurrent visibility action on this Carousel is
				 * correctly fired first. The reason is that in the example of a Dialog, we want to reset the position of the
				 * nested Carousel, but we cannot call window.scrollTo on a hidden element, which is what this functionality is
				 * based on. This simplifies the render order of operations.
				 */
				setTimeout(() => {
					switch (step) {
						case 'page':
							scrollCarouselPosition(
								(carouselItemsRef.current?.offsetWidth || DEFAULT_CONTAINER_WIDTH) * index,
								behavior,
							)
							break
						default:
							if (carouselHandler.carouselItems)
								scrollCarouselPosition(carouselHandler.carouselItems[index].offsetLeft, behavior)
					}
				}, 1)
			}
		}

		const isComponentVisible = () => {
			return carouselContainerRef.current?.checkVisibility?.({
				checkVisibilityCSS: true,
			})
		}

		const handleBreakpoints = useCallback(() => {
			if (!breakpoints) {
				setCurrentDisplayItems(displayItems)
				return
			}
			const currentWindowWidth = window.innerWidth
			const breakpointConfig = carouselHandler.resolveBreakpointByScreen(breakpoints, currentWindowWidth)
			if (breakpointConfig) {
				if (breakpointConfig?.displayItems !== currentDisplayItems)
					setCurrentDisplayItems(breakpointConfig?.displayItems ?? displayItems)
				if (breakpointConfig?.spaceBetween)
					carouselContainerRef.current?.style.setProperty(
						'--carousel-item-spacing',
						`${breakpointConfig?.spaceBetween}px`,
					)
				if (breakpointConfig?.fullbleed !== undefined) setCurrentFullbleed(breakpointConfig?.fullbleed)
				setCurrentSwipeInteraction(breakpointConfig?.swipeInteraction ?? swipeInteraction)
			} else {
				setCurrentDisplayItems(displayItems)
				if (spaceBetween !== undefined)
					carouselContainerRef.current?.style.setProperty('--carousel-item-spacing', `${spaceBetween}px`)
			}
		}, [breakpoints, carouselHandler, currentDisplayItems, displayItems, spaceBetween, swipeInteraction])

		const renderCarouselItems = useMemo(
			() =>
				Children.map(children, (child, i) => {
					return cloneElement(child, {
						key: `item_${i}`,
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore // this is completely valid.
						'aria-label': `${i + 1} / ${slideCount}`,
						'data-group': `${Math.ceil((i + 1) / (currentDisplayItems || 0))}`,
						'aria-current': i === activeIndex,
					})
				}),
			[activeIndex, children, currentDisplayItems, slideCount],
		)

		/**
		 * Will determine if we need navigational elements on the carousel, and enable the appropriate button.
		 * Visibility and resize events will also fire off this update so we can check for breakpoints.
		 */
		const calculateNavigationalControls = useCallback(() => {
			if (
				children &&
				carouselHandler.carouselItems?.length /*  && (carouselItemsRef.current?.offsetWidth ?? 0) > 0 */
			) {
				const totalSlides = carouselHandler.carouselItems.length
				const totalWidth =
					carouselHandler.resolveTotalItemsWidth(carouselHandler.carouselItems) ||
					(totalSlides / (currentDisplayItems ?? 1)) * DEFAULT_CONTAINER_WIDTH

				if (showNavigation) {
					// this math may be wrong with the actual item width not being calculated differently than item width
					const containerItemsWidth = carouselItemsRef.current?.offsetWidth || DEFAULT_CONTAINER_WIDTH

					const currentSlidePosition = carouselItemsRef.current?.scrollLeft ?? 0

					const computedStyle = window.getComputedStyle(carouselHandler.carouselItems[0])
					const marginCalc = parseFloat(computedStyle?.marginLeft) || 0 + parseFloat(computedStyle?.marginRight) || 0
					const paddingCalc = parseFloat(computedStyle?.paddingLeft) || 0 + parseFloat(computedStyle?.paddingRight) || 0
					const borderCalc =
						parseFloat(computedStyle?.borderLeftWidth) || 0 + parseFloat(computedStyle?.borderRightWidth) || 0

					// create actual item width
					const baseItemWidth = totalWidth / totalSlides
					const itemWidthCalc = baseItemWidth + marginCalc + paddingCalc + borderCalc
					const itemWidthCalcWithGap = itemWidthCalc + (spaceBetween || 0)

					// THIS IS FIXING THE MATH FOR THE TOTAL WIDTH
					const totalSpaceCreatedByGap = (totalSlides - 1) * (spaceBetween || 0)

					const totalWidthCalc = totalSlides * itemWidthCalc + totalSpaceCreatedByGap
					const currentActiveIndex = Math.round(currentSlidePosition / itemWidthCalcWithGap)

					const hasNavigation = totalWidth > containerItemsWidth + 1
					const hasMorePages = totalWidthCalc - currentSlidePosition > containerItemsWidth
					const isAtLastSlide = currentActiveIndex >= totalSlides - (currentDisplayItems ?? 1)
					const isEnd = isAtLastSlide || !hasMorePages

					/**
					 * This will broadcast the index change (index being the scroll position returned) only if there is
					 * a diff between the old and new, since this function may fire more often than the change.
					 */
					if (activeIndex !== currentActiveIndex) {
						onIndexChange?.(currentActiveIndex, { isEnd })
						if (isEnd) {
							onCarouselEnd?.()
						}
					}
					setActiveIndex(currentActiveIndex)
					setNextDisabled(isEnd)
					setPrevDisabled(currentSlidePosition <= 0)
					setNavigationDisabled(!hasNavigation)
				}
				handleBreakpoints()
			}
		}, [
			activeIndex,
			handleBreakpoints,
			children,
			carouselHandler,
			onIndexChange,
			showNavigation,
			currentDisplayItems,
			spaceBetween,
			onCarouselEnd,
		])

		/**
		 * This custom hook determines if the component is physically on the screen, before it proceeds
		 * to calculate the navigation logic.
		 */
		const isVisible = useOnScreen(carouselItemsRef)
		useEffect(() => {
			if (isVisible) calculateNavigationalControls()
		}, [calculateNavigationalControls, isVisible])

		/**
		 * Each time the width of the page is updated, we need to re-assess the breakpoint configurations
		 */
		useEffect(() => {
			if (isComponentVisible()) handleBreakpoints()
		}, [handleBreakpoints, width])

		useEffect(() => {
			if (currentDisplayItems) {
				const itemWidthComputed = 100 / currentDisplayItems
				carouselContainerRef.current?.style.setProperty('--carousel-item-width', `${itemWidthComputed}%`)
				carouselContainerRef.current?.style.setProperty('--carousel-item-count', `${currentDisplayItems}`)
			} else {
				carouselContainerRef.current?.style.setProperty('--carousel-item-width', 'auto')
			}
			if (spaceBetween !== undefined) {
				carouselContainerRef.current?.style.setProperty('--carousel-item-spacing', `${spaceBetween}px`)
			}
			calculateNavigationalControls()
		}, [calculateNavigationalControls, currentDisplayItems, height, initialItem, spaceBetween, children])

		/**
		 * Due to mounting issues and collision with some RSC rendering, to guarantee that we have mounted the component and
		 * have access to the DOM to calculate the spacing, we need to act on a resize observer, which will also help in
		 * any re-calculations based on component resize.
		 */
		useEffect(() => {
			const delay = initialItemScrollBehavior === 'smooth' ? 100 : 0
			if (initialItem !== undefined && !mountInterval.current && !initialPositionFired.current) {
				mountInterval.current = setInterval(() => {
					if (carouselHandler.carouselItems) {
						const selectedItem = carouselHandler.carouselItems[initialItem]
						if ((selectedItem?.offsetLeft ?? 0) > 0) {
							scrollCarouselPosition(selectedItem.offsetLeft, initialItemScrollBehavior)
							initialPositionFired.current = true
							clearInterval(mountInterval.current)
						}
					}
				}, delay)
			}
			return () => {
				if (mountInterval.current && initialPositionFired.current) clearInterval(mountInterval.current)
			}
		}, [carouselHandler.carouselItems, initialItem, initialItemScrollBehavior])

		function scrollCarouselPosition(pos: number, behavior: ScrollBehavior = 'smooth') {
			carouselItemsRef.current?.scrollTo?.({ left: pos, top: 0, behavior })
		}

		const getSlideItemWidth = () => {
			const firstItem: HTMLDivElement | null = carouselHandler?.carouselItems?.length
				? carouselHandler.carouselItems[0]
				: null
			return firstItem?.offsetWidth ?? 0
		}

		const handlePrevSlide = () => {
			if (carouselHandler.carouselItems?.length) {
				const currentSlidePosition = carouselItemsRef.current?.scrollLeft ?? 0
				const newSlidePosition = () => {
					if (step === 'page')
						return currentSlidePosition - (carouselItemsRef.current?.offsetWidth || DEFAULT_CONTAINER_WIDTH)
					return currentSlidePosition - getSlideItemWidth()
				}
				scrollCarouselPosition(newSlidePosition())
			}
		}

		const handleNextSlide = () => {
			if (carouselHandler.carouselItems?.length) {
				const currentSlidePosition = carouselItemsRef.current?.scrollLeft ?? 0
				const nextSlidePosition = () => {
					let newSlidePosition = 0
					const containerItemsWidth = carouselItemsRef.current?.offsetWidth || DEFAULT_CONTAINER_WIDTH
					if (step === 'page') {
						newSlidePosition = currentSlidePosition + containerItemsWidth
					} else {
						newSlidePosition = currentSlidePosition + getSlideItemWidth()
					}
					const carouselItemTotalWidth =
						carouselHandler.totalWidth || getSlideItemWidth() * (carouselHandler.carouselItems?.length || 0)
					// calculates the upper limit of sliding to the next page, so it will only go to the end of the slide container, and
					// not introduce a lot of white space.
					return carouselItemTotalWidth + newSlidePosition < containerItemsWidth
						? containerItemsWidth - carouselItemTotalWidth
						: newSlidePosition
				}
				scrollCarouselPosition(nextSlidePosition())
			}
		}

		const navActionProps: NavActionsProps = {
			onNextClick: handleNextSlide,
			onPrevClick: handlePrevSlide,
			nextDisabled,
			prevDisabled,
			showPagination: showPagination ?? false,
		}

		const handleScroll = useDebouncedCallback(() => {
			calculateNavigationalControls()
		}, scrollDebounce)

		/** Mouse drag interaction handlers ********************************** */
		const isDragging = useRef(false)
		const dragStartPos = useRef(0)
		const swipeDistance = useMemo(() => (currentSwipeInteraction === 'flick' ? 2 : 1), [currentSwipeInteraction])
		const handleMouseUp = () => {
			isDragging.current = false
			window.removeEventListener('mouseup', handleMouseUp)
		}

		const handleMouseDown = (e) => {
			if (isDragging.current) return
			isDragging.current = true
			dragStartPos.current = e.clientX
			window.addEventListener('mouseup', handleMouseUp)
		}

		const handleMouseMove = (e) => {
			if (!isDragging.current) return
			const currentSlidePosition = carouselItemsRef.current?.scrollLeft ?? 0
			const newScrollPos = currentSlidePosition - (e.clientX - dragStartPos.current) * swipeDistance
			scrollCarouselPosition(newScrollPos)
		}

		/** Keyboard interaction handlers ********************************** */
		const handleKeyInput = (e: KeyboardEvent) => {
			const { key } = e
			switch (key) {
				case 'ArrowRight':
					handleNextSlide()
					break
				case 'ArrowLeft':
					handlePrevSlide()
					break
			}
		}
		const handleKeyboardBinding = () => {
			window.addEventListener('keydown', handleKeyInput)
		}

		const removeKeyboardBinding = () => {
			window.removeEventListener('keydown', handleKeyInput)
		}

		/** Touch handlers to enforce interactions on iOS mobile devices ** */
		const start = useRef<{ x: number; scroll: number }>({ x: 0, scroll: 0 })
		const handleTouchStart = (event) => {
			start.current = {
				x: event.changedTouches[0].clientX,
				scroll: carouselItemsRef.current?.scrollLeft || 0,
			}
		}
		const handleTouchEnd = (event) => {
			const offsetX = (start.current.x - event.changedTouches[0].clientX) * swipeDistance
			const offsetScroll = start.current.scroll - (carouselItemsRef.current?.scrollLeft || 0)
			if (offsetScroll === 0) {
				const currentSlidePosition = carouselItemsRef.current?.scrollLeft ?? 0
				const newScrollPos = currentSlidePosition + offsetX
				scrollCarouselPosition(newScrollPos)
			}
		}

		const navIsVisible = showNavigation && !navigationDisabled

		return (
			<>
				<section
					ref={carouselContainerRef}
					className={`carousel ${styles.container} ${currentFullbleed ? styles.fullbleed : ''} ${className}`}
					tabIndex={0}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onFocus={handleKeyboardBinding}
					onBlur={removeKeyboardBinding}
					role="listbox"
					data-fullbleed={currentFullbleed}
					data-displayitems={currentDisplayItems}
				>
					<div
						ref={carouselItemsRef}
						className={`carousel-items ${styles['carousel-items']}`}
						onTouchStart={handleTouchStart}
						onTouchEnd={handleTouchEnd}
						onScroll={handleScroll}
						data-testid={'carousel-items'}
					>
						{renderCarouselItems}
					</div>
					{navIsVisible && !useRoundNav && <NavActions {...navActionProps} />}
				</section>
				{navIsVisible && useRoundNav && <RoundNavActions {...navActionProps} />}
				{showPagination && (
					<CarouselPagination
						itemContainer={carouselItemsRef.current}
						step={step}
						displayItems={currentDisplayItems}
						slideCount={slideCount}
						onClick={slideTo}
						activeIndex={activeIndex}
					/>
				)}
			</>
		)
	}),
)

export type CarouselItemProps = HTMLDivElement

export const CarouselItem = ({ className = '', children, ...attrs }) => {
	return (
		<div data-carousel-item="true" role="group" className={className} {...attrs}>
			{children}
		</div>
	)
}

// export const Carousel = React.memo(CarouselBase)
