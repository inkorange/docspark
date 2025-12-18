'use client'

import { useEffect, useLayoutEffect } from 'react'

/**
 * Will leverage the current client side render state via the window object to allow the standard usages of useLayoutEffect.
 * If the component is being rendered on the server-side, it will fallback to useEffect.
 */
export const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect
