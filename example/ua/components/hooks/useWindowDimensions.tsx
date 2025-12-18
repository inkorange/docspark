'use client'

import { useCallback, useEffect, useState } from 'react'
import { useDebouncedCallback } from './useDebouncedCallback'

export default function useWindowDimensions() {
	const hasWindow = typeof window !== 'undefined'

	const getWindowDimensions = useCallback(() => {
		const width = hasWindow ? window.innerWidth : null
		const height = hasWindow ? window.innerHeight : null
		return {
			width,
			height,
		}
	}, [hasWindow])

	const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

	const handleResize = useDebouncedCallback(() => {
		setWindowDimensions(getWindowDimensions())
	}, 150)

	useEffect(() => {
		if (hasWindow) {
			handleResize()
			window.addEventListener('resize', handleResize)
			return () => window.removeEventListener('resize', handleResize)
		}

		return undefined
	}, [getWindowDimensions, handleResize, hasWindow])

	return windowDimensions
}
