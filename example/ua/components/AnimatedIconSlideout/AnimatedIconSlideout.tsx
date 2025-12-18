'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './AnimatedIconSlideout.module.scss'

import React, { useEffect, useRef, useState } from 'react'

export const AnimationDirection = ['left', 'left-lg-up', 'left-lg-down', 'right-lg-up', 'right-lg-down'] as const

interface AnimatedIconSlideoutProps {
	/** Label to show on slideout */
	label: string

	/** SVG Image that lays over slide animation */
	icon: React.ReactNode

	/** Direction of slide animation */
	directions?: (typeof AnimationDirection)[number][]

	/** Delay to start animation */
	delay?: number

	/** Boolean to trigger animation on hover */
	shouldTriggerOnHover?: boolean

	/** Boolean to enable looping animation */
	isLooping?: boolean
}

/** Animated Icon Slide out is an animated chip component that will slide text out from the side */
export const AnimatedIconSlideout = ({
	label,
	icon,
	delay,
	shouldTriggerOnHover,
	directions = ['left'],
	isLooping = true,
}: AnimatedIconSlideoutProps) => {
	const hasMounted = useRef(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const divRef = useRef<HTMLDivElement>(null)
	const [classes, setClasses] = useState<string[]>([])
	const isAnimatingRef = useRef(false)
	const directionClasses: string[] = []
	directions?.forEach((direction) => {
		directionClasses.push(styles[direction])
	})

	// TODO: Add more directions
	if (isLooping) directionClasses.push(styles['left-looping'])

	useEffect(() => {
		const currentContainerRef = containerRef.current
		const currentDivRef = divRef.current

		function handleAnimationStart() {
			isAnimatingRef.current = true
		}

		function handleAnimationEnd() {
			isAnimatingRef.current = false
			if (!shouldTriggerOnHover) return
			setClasses([])
		}

		function handleMouseEnter() {
			if (!shouldTriggerOnHover) return
			const classes: string[] = []
			directions.forEach((direction) => {
				classes.push(styles[`${direction}-hover`])
			})

			setClasses(classes)
		}

		currentDivRef.addEventListener('animationstart', handleAnimationStart)
		currentDivRef.addEventListener('animationend', handleAnimationEnd)
		currentDivRef.addEventListener('transitionend', handleAnimationEnd)
		currentContainerRef.addEventListener('mouseover', handleMouseEnter)

		if (delay && !hasMounted.current) {
			hasMounted.current = true
			setTimeout(() => {
				if (isAnimatingRef.current) return
				const classes: string[] = []
				directions.forEach((direction) => {
					classes.push(styles[`${direction}-hover`])
				})

				setClasses(classes)
			}, delay)
		}

		return () => {
			currentDivRef?.removeEventListener('animationstart', handleAnimationStart)
			currentDivRef?.removeEventListener('animationend', handleAnimationEnd)
			currentDivRef?.removeEventListener('transitionend', handleAnimationEnd)
			currentContainerRef?.removeEventListener('mouseover', handleMouseEnter)
		}
	}, [delay, shouldTriggerOnHover, directions])

	return (
		<div ref={containerRef} className={`${styles.animation} ${directionClasses.join(' ')} ${classes.join(' ')}`}>
			<div ref={divRef}>
				<svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect width="100%" height="100%" rx="0" fill="currentColor" />
				</svg>
				<span>{label}</span>
			</div>
			{icon}
		</div>
	)
}
