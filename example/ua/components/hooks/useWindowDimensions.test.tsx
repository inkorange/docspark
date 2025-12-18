import { renderHook, fireEvent, screen, render, act, waitFor } from '@testing-library/react'
import useWindowDimensions from '../components/hooks/useWindowDimensions'

describe('useWindowDimensions', () => {
	beforeEach(() => {
		jest.useFakeTimers()
	})

	afterEach(() => {
		jest.useRealTimers()
	})

	const ComponentRender = () => {
		const { width, height } = useWindowDimensions()
		return (
			<>
				<div>{width}</div>
				<div>{height}</div>
			</>
		)
	}
	it('renders the default dimensions correctly', async () => {
		const { result } = renderHook(() => useWindowDimensions())

		expect(result.current).toStrictEqual({
			width: 1024,
			height: 768,
		})
	})

	it('handles a resize event and broadcasts the updated dimensions', async () => {
		render(<ComponentRender />)

		await act(async () => {
			window.innerWidth = 1000
			window.innerHeight = 500
			fireEvent.resize(window)
			jest.advanceTimersByTime(500)
		})

		await waitFor(() => {
			expect(screen.getByText('1000')).toBeInTheDocument()
		})
	})

	// Mocking the window object to undefined causes the entire test not to render.
	it.todo('returns appropriate response when there is no window object')
})
