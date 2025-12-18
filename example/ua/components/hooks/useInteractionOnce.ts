'use client'

import { useEffect, useState } from 'react'

/**
 * Runs a callback the first time a user interacts with the screen
 * @param callback
 */
export default function useInteractionOnce(callback?: () => void) {
	const [hasInteracted, setHasInteracted] = useState(false)
	useEffect(() => {
		if (hasInteracted || !callback) return () => null

		function handleEvent() {
			try {
				callback?.()
			} catch {
				// Ignore any failure
			}
			setHasInteracted(true)
		}
		window.addEventListener('pointermove', handleEvent)
		window.addEventListener('keydown', handleEvent)
		return () => {
			window.removeEventListener('pointermove', handleEvent)
			window.removeEventListener('keydown', handleEvent)
		}
	}, [hasInteracted, callback])
}
