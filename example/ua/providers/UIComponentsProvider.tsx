'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { type ComponentLabels, defaultLabelLibrary, type UILabelLibrary } from './defaultLabelLibrary'
import { mergeDeep } from '../components/lib/util'
import { useDeviceDetect } from '../components/hooks/useDeviceDetect'

interface UIComponentsContextInterface {
	getLabelText: (component: ComponentLabels, key: string) => string
	labelLibrary: UILabelLibrary
	preventScroll: () => void
	restoreScroll: () => void
	isScrollingDisabled: (bodyElement: HTMLElement) => boolean
}

interface UIComponentsProviderProps {
	labelConfig?: Partial<UILabelLibrary>
	fonts?: {
		base: string
		alternate: string
	}
}

export const defaultUIComponentProvider: UIComponentsContextInterface = {
	/** In the event the context is referenced outside the Provider, we'd still get default values. */
	getLabelText: (component, key) => defaultLabelLibrary[component][key],
	/** Used mainly for testing currently, but a full dump of the merged label library. */
	labelLibrary: defaultLabelLibrary,
	preventScroll: () => false,
	restoreScroll: () => false,
	isScrollingDisabled: () => false,
}
export const UIComponentContext = createContext(defaultUIComponentProvider)

export function useComponentContext() {
	return useContext(UIComponentContext)
}

/**
 * UI Component Provider that enforces the translated labels needed for a subset of the components in the library.
 * This allows a stateful hook into the consumer's translated strings to push an update to the translations when the
 * locale changes as per the consumer's business logic to do so.
 */
export function UIComponentsProvider({
	labelConfig = defaultLabelLibrary,
	fonts,
	children,
}: React.PropsWithChildren<UIComponentsProviderProps>): React.ReactElement {
	const scrollRef = useRef<number | undefined>(undefined)
	const { currentDevice } = useDeviceDetect()

	useEffect(() => {
		/**
		 * Inject the css variables to the root when supplied, enforces a global scope so that
		 * the component library can read it.
		 */
		if (fonts) {
			document.documentElement.style.setProperty('--font-base', fonts.base)
			document.documentElement.style.setProperty('--font-alternative', fonts.alternate)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const labelLibrary: UILabelLibrary = useMemo(
		() => mergeDeep({ ...defaultLabelLibrary }, { ...labelConfig }),
		[labelConfig],
	)

	/**
	 * Prevents document body scrolling. (dialog background)
	 * @returns {void}
	 */
	const preventScroll = useCallback(() => {
		document.body.style.overflow = 'hidden'
		if (currentDevice === 'ios') {
			// The following properties are needed for iOS/Safari to respect overflow:hidden
			// eslint-disable-next-line no-param-reassign
			scrollRef.current = window.scrollY
			document.body.style.setProperty('position', 'fixed')
			document.body.style.setProperty('width', '100%')
			document.body.style.setProperty('top', `${-1 * scrollRef.current}px`)
			document.body.classList.add('on-scroll')
		}
	}, [currentDevice])

	/**
	 * Restores document body scrolling. (dialog background)
	 * @returns {void}
	 */
	const restoreScroll = useCallback(() => {
		document.body.style.removeProperty('overflow')

		if (currentDevice === 'ios') {
			// Removing properties needed for iOS/Safari workarounds
			document.body.style.removeProperty('position')
			document.body.style.removeProperty('width')
			document.body.style.removeProperty('top')
			window.scrollTo(0, parseInt(scrollRef.current?.toString() || '0', 10))
			setTimeout(() => {
				document.body.classList.remove('on-scroll')
			}, 100)
		}
	}, [currentDevice])

	/**
	 * Checks if document.body scrolling is disabled (overflow:hidden)
	 * @param bodyElement The HTMLElement representing document.body
	 * @returns True if scrolling is disabled (overflow is 'hidden'), false otherwise
	 */
	function isScrollingDisabled(bodyElement: HTMLElement): boolean {
		return bodyElement.style.overflow === 'hidden'
	}

	const contextValue = useMemo(() => {
		const getLabelText = (component: ComponentLabels, key: string): string => {
			return labelLibrary[component][key]
		}
		return {
			getLabelText,
			labelLibrary,
			preventScroll,
			restoreScroll,
			isScrollingDisabled,
		}
	}, [labelLibrary, preventScroll, restoreScroll])

	return <UIComponentContext.Provider value={contextValue}>{children}</UIComponentContext.Provider>
}

export function keyReplace(template: string, values: { [key: string]: string | number }): string {
	return template.replace(/{([^}]+)}/g, (match, key) => {
		return values[key]?.toString() ?? match
	})
}
