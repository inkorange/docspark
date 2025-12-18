import type React from 'react'

function exposeRefTo<T extends Element>(
	...refs: (React.MutableRefObject<T | null> | React.RefCallback<T> | null | undefined)[]
) {
	return function refCallback(reactRef: T | null): void {
		refs.forEach((ref) => {
			if (!ref) return
			if (typeof ref === 'function') ref(reactRef)
			else ref.current = reactRef // eslint-disable-line no-param-reassign -- Needed for `ref` exposure to work
		})
	}
}

export default exposeRefTo
