import { act, render, screen, fireEvent, waitFor } from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import { Toast } from './Toast'

// Mock Date.now for consistent timing
const mockDateNow = jest.fn()
Object.defineProperty(Date, 'now', {
	value: mockDateNow,
	writable: true,
})

// Mock requestAnimationFrame and cancelAnimationFrame
let mockAnimationFrameId = 0
const mockCallbacks: { [id: number]: FrameRequestCallback } = {}

const mockRequestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
	mockAnimationFrameId++
	mockCallbacks[mockAnimationFrameId] = callback
	return mockAnimationFrameId
})

const mockCancelAnimationFrame = jest.fn((id: number) => {
	delete mockCallbacks[id]
})

const triggerAnimationFrame = () => {
	Object.values(mockCallbacks).forEach((callback) => {
		callback(performance.now())
	})
}

Object.defineProperty(global, 'requestAnimationFrame', {
	value: mockRequestAnimationFrame,
	writable: true,
})

Object.defineProperty(global, 'cancelAnimationFrame', {
	value: mockCancelAnimationFrame,
	writable: true,
})

describe('Toast (Component)', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		mockAnimationFrameId = 0
		Object.keys(mockCallbacks).forEach((key) => delete mockCallbacks[parseInt(key)])
		mockDateNow.mockReturnValue(1000) // Fixed timestamp
	})

	afterEach(() => {
		// no-op
	})

	it('should render the toast message', () => {
		render(<Toast>Test Toast Message</Toast>)
		expect(screen.getByText('Test Toast Message')).toBeInTheDocument()
	})

	it('should apply custom className', () => {
		render(<Toast className="custom-class">Test Toast Message</Toast>)
		expect(screen.getByTestId('toast')).toHaveClass('custom-class')
	})

	it('should render with data-testid', () => {
		render(<Toast>Test Toast Message</Toast>)
		expect(screen.getByTestId('toast')).toBeInTheDocument()
	})

	it('should pass through additional props', () => {
		render(<Toast data-custom="test-value">Test Toast Message</Toast>)
		expect(screen.getByTestId('toast')).toHaveAttribute('data-custom', 'test-value')
	})

	it('should call onOpen when component mounts', () => {
		const onOpenMock = jest.fn()
		render(<Toast onOpen={onOpenMock}>Test Toast Message</Toast>)
		expect(onOpenMock).toHaveBeenCalledTimes(1)
	})

	it('should call onRemove when component unmounts', () => {
		const onRemoveMock = jest.fn()
		const { unmount } = render(<Toast onRemove={onRemoveMock}>Test Toast Message</Toast>)

		unmount()
		expect(onRemoveMock).toHaveBeenCalledTimes(1)
	})

	it('should not call onOpen if not provided', () => {
		expect(() => {
			render(<Toast>Test Toast Message</Toast>)
		}).not.toThrow()
	})

	it('should not call onRemove if not provided', () => {
		const { unmount } = render(<Toast>Test Toast Message</Toast>)
		expect(() => {
			unmount()
		}).not.toThrow()
	})

	describe('Timer functionality', () => {
		it('should not start timer when timer prop is not provided', () => {
			render(<Toast>Test Toast Message</Toast>)
			expect(mockRequestAnimationFrame).not.toHaveBeenCalled()
		})

		it('should not start timer when timer is 0', () => {
			render(<Toast timer={0}>Test Toast Message</Toast>)
			expect(mockRequestAnimationFrame).not.toHaveBeenCalled()
		})

		it('should not start timer when timer is negative', () => {
			render(<Toast timer={-100}>Test Toast Message</Toast>)
			expect(mockRequestAnimationFrame).not.toHaveBeenCalled()
		})

		it('should start timer when timer prop is provided', () => {
			render(<Toast timer={5000}>Test Toast Message</Toast>)

			// Check if the timer prop is being used to set initial style
			const toastElement = screen.getByTestId('toast')
			expect(toastElement).toHaveStyle({ '--Toast-timer-progress': '100%' })

			// useEffect should call requestAnimationFrame
			expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1)
		})

		it('should set initial timer progress style when timer is provided', () => {
			render(<Toast timer={5000}>Test Toast Message</Toast>)
			const toastElement = screen.getByTestId('toast')
			expect(toastElement).toHaveStyle({ '--Toast-timer-progress': '100%' })
		})

		it('should not set timer progress style when timer is not provided', () => {
			render(<Toast>Test Toast Message</Toast>)
			const toastElement = screen.getByTestId('toast')
			expect(toastElement.style.getPropertyValue('--Toast-timer-progress')).toBe('')
		})

		it('should update progress percentage as time elapses', () => {
			mockDateNow.mockReturnValueOnce(1000).mockReturnValueOnce(1016) // 16ms elapsed

			render(<Toast timer={1000}>Test Toast Message</Toast>)

			// Trigger the animation frame callback
			act(() => {
				triggerAnimationFrame()
			})

			// Progress should have decreased slightly
			const toastElement = screen.getByTestId('toast')
			const progressStyle = toastElement.style.getPropertyValue('--Toast-timer-progress')
			expect(progressStyle).not.toBe('100%')
		})

		it('should cancel animation frame on unmount', () => {
			const { unmount } = render(<Toast timer={5000}>Test Toast Message</Toast>)

			// Get the animation frame ID that was created
			const frameId = mockRequestAnimationFrame.mock.results[0]?.value

			unmount()
			expect(mockCancelAnimationFrame).toHaveBeenCalledWith(frameId)
		})

		it('should restart timer when timer prop changes', () => {
			const { rerender } = render(<Toast timer={1000}>Test Toast Message</Toast>)

			expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1)

			rerender(<Toast timer={2000}>Test Toast Message</Toast>)
			expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(2)
		})

		it('should handle timer reaching zero', () => {
			mockDateNow
				.mockReturnValueOnce(1000) // Initial start time
				.mockReturnValueOnce(2000) // 1000ms elapsed (timer complete)

			render(<Toast timer={1000}>Test Toast Message</Toast>)

			// Trigger the animation frame callback when timer should be complete
			act(() => {
				triggerAnimationFrame()
			})

			// Should not request another frame when timer reaches 0
			expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1)
		})
	})

	describe('Edge cases', () => {
		it('should handle undefined className gracefully', () => {
			render(<Toast className={undefined}>Test Toast Message</Toast>)
			expect(screen.getByTestId('toast')).toBeInTheDocument()
		})

		it('should generate unique IDs for multiple toast instances', () => {
			const { container } = render(
				<div>
					<Toast>First Toast</Toast>
					<Toast>Second Toast</Toast>
				</div>,
			)

			const toasts = container.querySelectorAll('[data-testid="toast"]')
			expect(toasts).toHaveLength(2)
			expect(toasts[0].id).not.toBe(toasts[1].id)
			expect(toasts[0].id).toBeTruthy()
			expect(toasts[1].id).toBeTruthy()
		})
	})
})
