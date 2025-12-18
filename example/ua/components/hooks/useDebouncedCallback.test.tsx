import { act, renderHook } from '@testing-library/react'

import { useDebouncedCallback } from './useDebouncedCallback'

describe('useDebouncedCallback()', () => {
	beforeEach(() => {
		jest.useFakeTimers()
	})

	afterEach(() => {
		jest.runOnlyPendingTimers()
		jest.useRealTimers()
	})

	test('should call the callback after single debounce within delay threshold', () => {
		const delay = 60000
		const callback = jest.fn()
		const {
			result: { current: debouncedCallback },
		} = renderHook(() => useDebouncedCallback(callback, delay))

		debouncedCallback()
		expect(callback).not.toHaveBeenCalled()

		act(() => {
			jest.advanceTimersByTime(delay)
		})
		expect(callback).toHaveBeenCalledTimes(1)
	})

	test('should call the callback after double debounce within delay threshold', () => {
		const delay = 60000
		const callback = jest.fn()
		const {
			result: { current: debouncedCallback },
		} = renderHook(() => useDebouncedCallback(callback, delay))

		debouncedCallback()
		expect(callback).not.toHaveBeenCalled()

		act(() => {
			jest.advanceTimersByTime(30000)
		})
		expect(callback).not.toHaveBeenCalled()

		debouncedCallback()
		act(() => {
			jest.advanceTimersByTime(delay)
		})

		expect(callback).toHaveBeenCalledTimes(1)
	})
})
