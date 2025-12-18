import '@testing-library/jest-dom'
import { screen, act, waitFor, fireEvent, render } from '@testing-library/react'
import { Carousel, type CarouselActions, CarouselItem, type CarouselProps, DEFAULT_CONTAINER_WIDTH } from './Carousel'
import React, { useRef, useEffect } from 'react'
import userEvent from '@testing-library/user-event'
import * as currentWindowDimensions from '../hooks/useWindowDimensions'
import * as currentOnScreen from '../hooks/useOnScreen'
import { constructRenderViewStates } from '~/__tests__/helpers/carousel-helper'

jest.mock('../hooks/useWindowDimensions.tsx', () => ({
	__esModule: true,
	...(jest.requireActual('../hooks/useWindowDimensions.tsx') as Record<string, unknown>),
}))

jest.mock('../hooks/useOnScreen', () => ({
	__esModule: true,
	...(jest.requireActual('../hooks/useOnScreen') as Record<string, unknown>),
}))

interface CarouselContainerProps extends CarouselProps {
	itemCount: number
	slideTo?: number | null | undefined
}
describe('Carousel', () => {
	const mockScrollLeft = (el: HTMLElement, position: number) => {
		Object.defineProperty(el, 'scrollLeft', {
			writable: true,
			configurable: true,
			value: position,
		})
		el.dispatchEvent(new Event('scroll'))
	}

	afterEach(() => {
		jest.resetAllMocks()
	})

	const scrollToFn = jest.fn()
	window.scrollTo = scrollToFn

	const CarouselContainer = ({ itemCount = 4, slideTo, ...attrs }: Omit<CarouselContainerProps, 'children'>) => {
		const carouselRef = useRef<CarouselActions>(null)
		useEffect(() => {
			if (slideTo !== undefined) carouselRef.current?.slideTo(slideTo === null ? undefined : slideTo) // trying to coerce the undefined value through
		}, [slideTo])
		return (
			<Carousel ref={carouselRef} {...attrs}>
				{new Array(itemCount).fill(null).map((_, i) => (
					<CarouselItem key={`swipeItem${i}`}>{i}</CarouselItem>
				))}
			</Carousel>
		)
	}

	describe('basic rendering', () => {
		it('renders correctly without crashing', () => {
			render(<CarouselContainer itemCount={10} spaceBetween={8} />)
			expect(screen.getByRole('listbox')).toBeInTheDocument()
			expect(screen.getAllByRole('group')).toHaveLength(10)
		})
		it('handles no children passed through', async () => {
			render(<CarouselContainer itemCount={0} spaceBetween={8} />)
			expect(screen.getByRole('listbox')).toBeInTheDocument()
			expect(screen.queryAllByRole('group')).toHaveLength(0)
		})
		it('handles initial item displays correctly', async () => {
			jest.useFakeTimers()
			jest.runAllTimers()
			const onIndexChangeFn = jest.fn()
			const { unmount } = render(
				<CarouselContainer
					itemCount={8}
					displayItems={1}
					initialItem={3}
					showPagination={true}
					onIndexChange={onIndexChangeFn}
				/>,
			)
			const { carouselScrollToMock } = constructRenderViewStates(screen)
			await act(() => {
				jest.advanceTimersByTime(500)
			})
			mockScrollLeft(screen.getByTestId('carousel-items'), DEFAULT_CONTAINER_WIDTH * 3)
			await waitFor(() => expect(screen.getAllByRole('group')[3]).toHaveAttribute('aria-current', 'true'))
			expect(carouselScrollToMock).toHaveBeenCalledWith({
				behavior: 'smooth',
				left: DEFAULT_CONTAINER_WIDTH * 3,
				top: 0,
			})
			unmount()

			jest.runOnlyPendingTimers()
			jest.useRealTimers()
		})
		it('will not scroll when the initial is the first item', async () => {
			jest.useFakeTimers()
			jest.runAllTimers()

			const { unmount } = render(<CarouselContainer itemCount={8} displayItems={4} initialItem={0} />)
			const { carouselScrollToMock } = constructRenderViewStates(screen)
			await act(() => {
				jest.advanceTimersByTime(500)
			})
			expect(carouselScrollToMock).not.toHaveBeenCalled()
			unmount()
			jest.runOnlyPendingTimers()
			jest.useRealTimers()
		})
		it('handles isVisible hook evaluation', async () => {
			jest.spyOn(currentOnScreen, 'useOnScreen').mockImplementation(() => true)
			render(<CarouselContainer itemCount={8} displayItems={4} />)
			constructRenderViewStates(screen)
			const nextButton = screen.getByTestId('next-arrow')
			const prevButton = screen.getByTestId('prev-arrow')
			await waitFor(() => expect(nextButton).not.toBeDisabled())
			await waitFor(() => expect(prevButton).toBeDisabled())
		})
	})
	describe('handles scrollTo method', () => {
		it('handles no scrolling when no index is supplied', async () => {
			const onIndexChangeFn = jest.fn()
			render(<CarouselContainer slideTo={null} itemCount={6} displayItems={3} onIndexChange={onIndexChangeFn} />)
			const { carouselScrollToMock } = constructRenderViewStates(screen)
			expect(carouselScrollToMock).not.toHaveBeenCalled()
		})
		/*it('handles scrollTo external functionality', async () => {
			const onIndexChangeFn = jest.fn()
			const { rerender } = render(<CarouselContainer itemCount={6} displayItems={3} onIndexChange={onIndexChangeFn} />)
			const { carouselScrollToMock } = constructRenderViewStates(screen)
			rerender(<CarouselContainer slideTo={4} itemCount={6} displayItems={3} onIndexChange={onIndexChangeFn} />)
			mockScrollLeft(screen.getByTestId('carousel-items'), DEFAULT_CONTAINER_WIDTH * 4)
			expect(carouselScrollToMock).toHaveBeenCalledWith({
				behavior: 'smooth',
				left: DEFAULT_CONTAINER_WIDTH * 4,
				top: 0,
			})
		})*/
	})

	describe('handles navigational controls', () => {
		it('handles next and previous clicks on full page scroll', async () => {
			const onCarouselEndFn = jest.fn()
			const onIndexChangeFn = jest.fn()
			render(
				<CarouselContainer
					itemCount={6}
					displayItems={3}
					onIndexChange={onIndexChangeFn}
					onCarouselEnd={onCarouselEndFn}
				/>,
			)
			screen.getByTestId('carousel-items').scrollTo = scrollToFn

			const nextButton = screen.getByTestId('next-arrow')
			const prevButton = screen.getByTestId('prev-arrow')

			await waitFor(() => expect(prevButton).toBeDisabled())
			await userEvent.click(nextButton)
			expect(scrollToFn).toHaveBeenCalledWith({ behavior: 'smooth', left: DEFAULT_CONTAINER_WIDTH, top: 0 })
			mockScrollLeft(screen.getByTestId('carousel-items'), DEFAULT_CONTAINER_WIDTH)
			await waitFor(() => expect(onIndexChangeFn).toHaveBeenCalledWith(3, { isEnd: true }))
			await waitFor(() => expect(onCarouselEndFn).toHaveBeenCalled())

			await waitFor(() => expect(nextButton).toBeDisabled())
			await waitFor(() => expect(prevButton).not.toBeDisabled())

			await userEvent.click(prevButton)
			expect(scrollToFn).toHaveBeenCalledWith({ behavior: 'smooth', left: 0, top: 0 })
		})
		it('handles next and previous clicks on single item scroll', async () => {
			const onIndexChangeFn = jest.fn()
			render(<CarouselContainer itemCount={8} step={'single'} displayItems={4} onIndexChange={onIndexChangeFn} />)
			const { carouselScrollToMock } = constructRenderViewStates(screen, DEFAULT_CONTAINER_WIDTH, 4)

			const nextButton = screen.getByTestId('next-arrow')
			// const prevButton = screen.getByTestId('prev-arrow')

			await userEvent.click(nextButton)
			expect(carouselScrollToMock).toHaveBeenCalledWith({ behavior: 'smooth', left: 75, top: 0 })
			mockScrollLeft(screen.getByTestId('carousel-items'), 75)
		})
		it('handles keyboard input', async () => {
			render(<CarouselContainer itemCount={6} displayItems={3} />)
			screen.getByTestId('carousel-items').scrollTo = scrollToFn

			const carousel = screen.getByRole('listbox')
			carousel.focus()

			const prevButton = screen.getByTestId('prev-arrow')

			await userEvent.keyboard('[ArrowRight]')
			expect(scrollToFn).toHaveBeenCalledWith({ behavior: 'smooth', left: DEFAULT_CONTAINER_WIDTH, top: 0 })
			mockScrollLeft(screen.getByTestId('carousel-items'), DEFAULT_CONTAINER_WIDTH)

			await waitFor(() => expect(prevButton).not.toBeDisabled())

			await userEvent.keyboard('[ArrowLeft]')
			expect(scrollToFn).toHaveBeenCalledWith({ behavior: 'smooth', left: 0, top: 0 })
		})
		it('handles mouse input', async () => {
			render(<CarouselContainer itemCount={6} displayItems={3} />)
			const { carouselScrollToMock } = constructRenderViewStates(screen)

			const carousel = screen.getByRole('listbox')
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseDown(carousel, { clientX: 200, clientY: 100 })
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseMove(carousel, { clientX: 20, clientY: 100 })
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseDown(carousel, { clientX: 20, clientY: 100 })
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseMove(carousel, { clientX: 10, clientY: 100 })

			expect(carouselScrollToMock).toHaveBeenCalledWith({ behavior: 'smooth', left: 190, top: 0 })
			mockScrollLeft(screen.getByTestId('carousel-items'), 190)
			// let's move again
			jest.replaceProperty(screen.getByTestId('carousel-items'), 'scrollLeft', 190)
			// jest.spyOn(screen.getByTestId('carousel-items'), 'scrollLeft').mockImplementation(190)
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseDown(carousel, { clientX: 10, clientY: 100 })
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseMove(carousel, { clientX: 200, clientY: 100 })
			expect(carouselScrollToMock).toHaveBeenCalledWith({ behavior: 'smooth', left: 190, top: 0 })
			mockScrollLeft(screen.getByTestId('carousel-items'), 190)
		})
		it('handles touch input', async () => {
			render(<CarouselContainer itemCount={6} displayItems={3} />)
			screen.getByTestId('carousel-items').scrollTo = scrollToFn

			const carouselItems = screen.getByTestId('carousel-items')
			fireEvent.touchStart(carouselItems, { changedTouches: [{ clientX: 200, clientY: 100 }] })
			fireEvent.touchEnd(carouselItems, { changedTouches: [{ clientX: 10, clientY: 100 }] })

			expect(scrollToFn).toHaveBeenCalledWith({ behavior: 'smooth', left: 190, top: 0 })
			mockScrollLeft(carouselItems, 190)
		})
		it('handles pagination actions correctly', async () => {
			const onIndexChangeFn = jest.fn()
			const { rerender } = render(
				<CarouselContainer itemCount={6} displayItems={3} showPagination={true} onIndexChange={onIndexChangeFn} />,
			)

			screen.getByTestId('carousel-items').scrollTo = scrollToFn
			const paginationButtons = screen.getByRole('button', { name: 'Slide 2 of 2' })
			await userEvent.click(paginationButtons)
			mockScrollLeft(screen.getByTestId('carousel-items'), DEFAULT_CONTAINER_WIDTH)

			rerender(
				<CarouselContainer
					itemCount={6}
					displayItems={3}
					step={'single'}
					showPagination={true}
					onIndexChange={onIndexChangeFn}
				/>,
			)
			const { carouselScrollToMock } = constructRenderViewStates(screen, DEFAULT_CONTAINER_WIDTH, 3)

			const singlePaginationButtons = screen.getByRole('button', { name: 'Slide 4 of 4' })
			await userEvent.click(singlePaginationButtons)
			mockScrollLeft(screen.getByTestId('carousel-items'), 300)
			expect(carouselScrollToMock).toHaveBeenCalledWith({ behavior: 'smooth', left: 300, top: 0 })
		})

		it('handles page pagination actions correctly', async () => {
			const onIndexChangeFn = jest.fn()
			render(
				<CarouselContainer
					itemCount={3}
					displayItems={0}
					showPagination={true}
					step="page"
					onIndexChange={onIndexChangeFn}
				/>,
			)

			screen.getByTestId('carousel-items').scrollTo = scrollToFn
			const paginationButtons = screen.getByRole('button', { name: 'Slide 1 of 3' })
			expect(paginationButtons).toBeInTheDocument()
			expect(paginationButtons.getElementsByTagName('span')[0]).toHaveAttribute('class', 'grid-indicator active-grid')
		})

		it('renders round navigation correctly', async () => {
			const onIndexChangeFn = jest.fn()
			render(<CarouselContainer itemCount={6} displayItems={3} useRoundNav />)

			screen.getByTestId('carousel-items').scrollTo = scrollToFn
			expect(screen.getByRole('button', { name: 'Previous Slide' })).toBeInTheDocument()
			expect(screen.getByRole('button', { name: 'Next Slide' })).toBeInTheDocument()
		})

		it('handles onIndexChange event for fractional transitions', async () => {
			const onIndexChangeFn = jest.fn()
			render(<CarouselContainer onIndexChange={onIndexChangeFn} itemCount={6} displayItems={3} />)
			screen.getByTestId('carousel-items').scrollTo = scrollToFn

			const carouselItems = screen.getByTestId('carousel-items')
			fireEvent.touchStart(carouselItems, { changedTouches: [{ clientX: 200, clientY: 100 }] })
			fireEvent.touchEnd(carouselItems, { changedTouches: [{ clientX: 710, clientY: 100 }] })

			// Verify that the onIndexChange event is called with the correct index based on Math.round
			// for fractional transitions such as 1/4 and 1/2
			mockScrollLeft(screen.getByTestId('carousel-items'), DEFAULT_CONTAINER_WIDTH * 0.25)
			await waitFor(() => expect(onIndexChangeFn).toHaveBeenCalledWith(1, { isEnd: false }))

			mockScrollLeft(screen.getByTestId('carousel-items'), DEFAULT_CONTAINER_WIDTH * 0.5)
			await waitFor(() => expect(onIndexChangeFn).toHaveBeenCalledWith(2, { isEnd: false }))
		})
	})

	describe('handles breakpoint configurations', () => {
		it('handles breakpoint configurations correctly', async () => {
			const onCarouselEndFn = jest.fn()
			const onIndexChangeFn = jest.fn()
			jest.spyOn(currentWindowDimensions, 'default').mockImplementation(() => ({ width: 500, height: 1000 }))
			global.innerWidth = 500

			const { rerender } = render(
				<CarouselContainer
					itemCount={6}
					displayItems={3}
					spaceBetween={16}
					onIndexChange={onIndexChangeFn}
					onCarouselEnd={onCarouselEndFn}
					breakpoints={{
						580: {
							displayItems: 2,
							spaceBetween: 8,
						},
						300: {
							displayItems: 1,
							spaceBetween: 16,
						},
					}}
				/>,
			)
			constructRenderViewStates(screen, DEFAULT_CONTAINER_WIDTH, 2)

			const carousel = screen.getByRole('listbox')
			const nextButton = screen.getByTestId('next-arrow')

			expect(carousel).toHaveAttribute('data-displayitems', '2')
			await userEvent.click(nextButton)
			mockScrollLeft(screen.getByTestId('carousel-items'), DEFAULT_CONTAINER_WIDTH)
			await waitFor(() => expect(onIndexChangeFn).toHaveBeenCalledWith(2, { isEnd: false }))

			jest.clearAllMocks()

			jest.spyOn(currentWindowDimensions, 'default').mockImplementationOnce(() => ({ width: 295, height: 1000 }))
			global.innerWidth = 295
			rerender(
				<CarouselContainer
					itemCount={6}
					displayItems={3}
					onIndexChange={onIndexChangeFn}
					onCarouselEnd={onCarouselEndFn}
					breakpoints={{
						580: {
							displayItems: 2,
							spaceBetween: 8,
						},
						300: {
							spaceBetween: 16,
							fullbleed: true,
						},
					}}
				/>,
			)

			const { carouselScrollToMock } = constructRenderViewStates(screen, DEFAULT_CONTAINER_WIDTH, 3)
			await userEvent.click(nextButton)

			expect(carousel).toHaveAttribute('data-displayitems', '3')
			expect(carouselScrollToMock).toHaveBeenCalledWith({ behavior: 'smooth', left: 600, top: 0 })
			mockScrollLeft(screen.getByTestId('carousel-items'), DEFAULT_CONTAINER_WIDTH)
			await waitFor(() => expect(onIndexChangeFn).toHaveBeenCalledWith(3, { isEnd: true }))
			await waitFor(() => expect(onCarouselEndFn).toHaveBeenCalled())
			expect(carousel).toHaveAttribute('data-fullbleed', 'true')
		})
		it('handles mismatched breakpoint configurations correctly', async () => {
			const onIndexChangeFn = jest.fn()
			jest.spyOn(currentWindowDimensions, 'default').mockImplementation(() => ({ width: 2000, height: 1000 }))
			global.innerWidth = 2000

			render(
				<CarouselContainer
					itemCount={6}
					displayItems={3}
					spaceBetween={8}
					onIndexChange={onIndexChangeFn}
					breakpoints={{
						580: {
							displayItems: 2,
						},
					}}
				/>,
			)

			screen.getByTestId('carousel-items').scrollTo = scrollToFn
			const carousel = screen.getByRole('listbox')
			expect(carousel).toHaveAttribute('data-displayitems', '3')
		})
	})
})
