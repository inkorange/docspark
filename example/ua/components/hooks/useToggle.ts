'use client'

import { useCallback, useState } from 'react'

const useToggle = (
	initialValue: boolean,
): {
	value: boolean
	handleToggle: () => void
	handleClose: () => void
	handleOpen: () => void
} => {
	const [value, setValue] = useState(initialValue)

	const handleToggle = useCallback(() => setValue((value) => !value), [])
	const handleClose = useCallback(() => setValue(false), [])
	const handleOpen = useCallback(() => setValue(true), [])

	return { value, handleToggle, handleClose, handleOpen }
}

export default useToggle
