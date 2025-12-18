'use client'

import { useCallback, useEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebouncedCallback<T extends (...args: Array<any>) => void>(callback: T, delay: number) {
	const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
	const savedCallback = useRef<T>(callback)

	// Remember the latest callback
	useEffect(() => {
		savedCallback.current = callback
	}, [callback])

	useEffect(() => {
		return () => clearTimeout(timeout.current)
	}, [])

	return useCallback(
		(...args: Parameters<T>) => {
			clearTimeout(timeout.current)
			timeout.current = setTimeout(() => {
				savedCallback.current(...args)
			}, delay)
		},
		[delay],
	)
}
