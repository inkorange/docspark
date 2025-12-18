/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item): boolean {
	return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * @param target
 * @param sources
 */
export function mergeDeep(target, ...sources) {
	if (!sources.length) return target
	const source = sources.shift()

	if (isObject(target) && isObject(source)) {
		Object.keys(source).forEach((key) => {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} })
				mergeDeep(target[key], source[key])
			} else {
				Object.assign(target, { [key]: source[key] })
			}
		})
	}

	return mergeDeep(target, ...sources)
}

/**
 * This function is an accessibility helper that is reused by several components to capture
 * the space bar event and toggles visibility of the content
 * @param e
 * @param onClick
 */
export const handleAccessibilityClick = (e, onClick) => {
	if (!onClick) return
	if (e.key === ' ' || e.code === 'Space' || e.keyCode === 32) {
		onClick(e)
		e.preventDefault()
	}
}
