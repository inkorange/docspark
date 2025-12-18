'use client'

import { useEffect, useState } from 'react'

export type CurrentDevice = 'android' | 'ios' | 'other' | null

const iOSDeviceList: string[] = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod']

export function useDeviceDetect() {
	const [currentDevice, setCurrentDevice] = useState<CurrentDevice>(null)
	const [deviceType, setDeviceType] = useState<string | null>(null)
	useEffect(() => {
		if (typeof window.navigator !== 'undefined') {
			const { userAgent, maxTouchPoints } = navigator

			let hasTouchScreen = false
			if ('maxTouchPoints' in navigator) {
				hasTouchScreen = maxTouchPoints > 0
			} else {
				const mQ = typeof matchMedia !== 'undefined' && matchMedia('(pointer:coarse)')
				if (mQ && mQ.media === '(pointer:coarse)') {
					hasTouchScreen = !!mQ.matches
				} else if ('orientation' in window) {
					hasTouchScreen = true
				} else {
					hasTouchScreen =
						/\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(userAgent) ||
						/\b(Android|Windows Phone|iPad|iPod)\b/i.test(userAgent)
				}
			}
			setDeviceType(hasTouchScreen ? 'mobile' : 'desktop')

			if (iOSDeviceList.includes(userAgent) || (userAgent.includes('Mac') && 'ontouchend' in document)) {
				setCurrentDevice('ios')
			} else if (userAgent.match(/Android/)) {
				setCurrentDevice('android')
			} else {
				setCurrentDevice('other')
			}
		}
	}, [])

	return { currentDevice, deviceType }
}
