'use client'

import { type RefObject, useEffect, useState } from 'react'

export function useOnScreen(ref: RefObject<HTMLDivElement>) {
	const [isIntersecting, setIntersecting] = useState(false)

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting))

		if (ref.current) observer.observe(ref.current)
		return () => observer.disconnect()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return isIntersecting
}
