import React from 'react'
import { renderHook, screen, render, act } from '@testing-library/react'
import { type RefObject, useRef } from 'react'
import { useOnScreen } from './useOnScreen'
import { intersect } from '../../../../__tests__/helpers/intersection-helper'

describe('useOnScreen', () => {
	const divRefMock = {
		current: {},
	}

	it('Initial intersection is false', async () => {
		const { result } = renderHook(() => useOnScreen(divRefMock as unknown as RefObject<HTMLDivElement>))

		expect(result.current).toBeFalsy()
	})
	function OnScreenDOM() {
		const itemsRef = useRef<HTMLDivElement>(null)
		const isVisible = useOnScreen(itemsRef)
		return (
			<div data-testid="root" ref={itemsRef}>
				isVisible: <span data-testid="visible-string">{isVisible ? 'true' : 'false'}</span>
			</div>
		)
	}

	it('When intersection is found it will return true', async () => {
		render(<OnScreenDOM />)
		const rootDiv = screen.getByTestId('root')
		await act(() => {
			intersect(rootDiv, true)
		})
		expect(screen.getByTestId('visible-string')).toHaveTextContent('true')
	})
})
