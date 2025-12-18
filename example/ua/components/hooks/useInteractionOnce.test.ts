import { renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useInteractionOnce from './useInteractionOnce'

describe('useInteractionOnce', () => {
	test('should call handler once during user interaction', async () => {
		const mockFn = jest.fn()
		renderHook(() => useInteractionOnce(() => mockFn()))
		await userEvent.keyboard('[ControlLeft>]')
		await userEvent.keyboard('[ControlLeft>]')
		expect(mockFn).toHaveBeenCalledTimes(1)
	})
	test('should not fail during user interaction if handler is undefined', async () => {
		const { result } = renderHook(() => useInteractionOnce(undefined as unknown as () => void))
		await userEvent.keyboard('[ControlLeft>]')
		await userEvent.keyboard('[ControlLeft>]')
		expect(result).toBeDefined()
	})
	test('should not call handler with no user interaction', async () => {
		const mockFn = jest.fn()
		renderHook(() => useInteractionOnce(() => mockFn()))
		expect(mockFn).toHaveBeenCalledTimes(0)
	})
})
