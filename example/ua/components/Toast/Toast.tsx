'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './Toast.module.scss'

import { useId, useEffect, useState, type PropsWithChildren } from 'react'

export interface ToastProps {
	className?: string
	/** Duration in milliseconds that creates a countdown line below the toast panel, this will not cause the `Toast` to be destroyed, it is just a visual indication. */
	timer?: number
	/** Callback function called when the toast is initially mounted */
	onOpen?: () => void
	/** Callback function called when the toast is unmounted, which would also be the visual destruction of the component in view. */
	onRemove?: () => void
}

/**
 * This is a primitive component that will render the Toast component for use within a Toast messaging solution within your
 * application. The component handles any count-down visualization, but it will not programatically show or destroy the component for them view.
 */
export const Toast = function Toast({
	className,
	timer,
	children,
	onOpen,
	onRemove,
	...attrs
}: PropsWithChildren<ToastProps>) {
	const id = useId()
	const [timeRemaining, setTimeRemaining] = useState(timer || 0)

	useEffect(() => {
		if (!timer || timer <= 0) return undefined

		/**
		 * Animating the bottom line to countdown based on a passed in timer prop.
		 * This is nothing but a visual, and any destruction of the component after the timer is
		 * complete would be handled by the consumer in the parent application.
		 */
		setTimeRemaining(timer)
		const startTime = Date.now()
		let animationFrame: number

		const updateProgress = () => {
			const elapsed = Date.now() - startTime
			const remaining = Math.max(0, timer - elapsed)
			setTimeRemaining(remaining)

			if (remaining > 0) {
				animationFrame = requestAnimationFrame(updateProgress)
			}
		}

		animationFrame = requestAnimationFrame(updateProgress)

		return () => {
			cancelAnimationFrame(animationFrame)
		}
	}, [timer])

	// Calls onOpen when the component is mounted
	// Call onRemove when component unmounts
	useEffect(() => {
		if (onOpen) {
			onOpen()
		}
		return () => {
			if (onRemove) {
				onRemove()
			}
		}
		// only evaluate when the component initially mounts
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const progressPercentage = timer && timer > 0 ? (timeRemaining / timer) * 100 : 100

	const timerStyle =
		timer && timer > 0
			? ({
					'--Toast-timer-progress': `${progressPercentage}%`,
			  } as React.CSSProperties)
			: {}

	return (
		<div className={`${styles.toast} ${className}`} id={id} data-testid="toast" style={timerStyle} {...attrs}>
			{children}
		</div>
	)
}
