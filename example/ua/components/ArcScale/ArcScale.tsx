'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './ArcScale.module.scss'

import React, { useCallback, useEffect, useRef, useState } from 'react'

const getValueInBounds = (value: number, min: number, max: number) => {
	if (value >= max) {
		return max
	}
	if (value <= min) {
		return min
	}
	return value
}

export type ArcScaleProps = {
	/** wrapper className */
	className?: string

	/** gap between ends of arc at bottom, in degrees, 1-180 */
	gap?: number

	/** percentage of arc to be filled, 0-100 */
	fillPercentage?: number

	/** transition fn, for ex: ease-in-out, cubic-bezier(0.1, 0.7, 1, 0.1) */
	animationFn?: string

	/** time for which the animation will play in ms */
	animationTime?: number

	/** show progress without animation */
	animationDisabled?: boolean

	/** is ready to show progress animation */
	startAnimation?: boolean

	/** The size of the scale, if left undefined, it will inherit the containing space */
	size?: number

	/** The stroke width of the scale */
	strokeWidth?: number
}

export const ArcScale = ({
	className,
	gap = 80,
	fillPercentage = 0,
	animationFn = 'ease-in-out',
	animationTime = 2000,
	animationDisabled = false,
	startAnimation = true,
	strokeWidth = 12,
	size,
}: ArcScaleProps) => {
	const viewBox = 100
	const percent = getValueInBounds(fillPercentage, 0, 100)
	const gapSize = getValueInBounds(gap, 0, 180)
	const radius = viewBox / 2 - strokeWidth / 2
	const startAngle = 90 + gapSize / 2

	const convertToRadians = useCallback((degrees: number) => degrees * (Math.PI / 180), [])
	const xCoordinate = useCallback(
		(angle: number) => radius * Math.cos(convertToRadians(angle)),
		[convertToRadians, radius],
	)
	const yCoordinate = useCallback(
		(angle: number) => radius * Math.sin(convertToRadians(angle)),
		[convertToRadians, radius],
	)
	const path = `M ${xCoordinate(startAngle)} ${yCoordinate(startAngle)} A ${radius} ${radius} 0 1 1 ${xCoordinate(
		startAngle - gapSize,
	)} ${yCoordinate(startAngle - gapSize)}`

	// fill animation
	const fillTrackRef = useRef<SVGPathElement | null>(null)
	const [readyToUse, setReadyToUse] = useState(false)
	const [fullLength, setFullLength] = useState(0)

	const fillValue = fullLength * ((100 - percent) / 100)

	useEffect(() => {
		if (fillTrackRef?.current?.getTotalLength && !fullLength) {
			setFullLength(fillTrackRef.current.getTotalLength())
		}
		if (fullLength && startAnimation) {
			setReadyToUse(true)
		}
		if (!startAnimation) {
			setReadyToUse(false)
		}
	}, [fullLength, startAnimation])

	return (
		<div className={className}>
			<svg
				viewBox={`${viewBox / -2} ${viewBox / -2} ${viewBox} ${viewBox}`}
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className={styles.arc}
				aria-hidden={true}
				width={size}
				height={size}
			>
				<path d={path} strokeWidth={strokeWidth * 0.5} strokeLinecap="round" />
				<path
					data-testid="fill-path"
					ref={fillTrackRef}
					d={path}
					strokeWidth={strokeWidth}
					strokeLinecap="round"
					className={readyToUse ? styles.show : ''}
					style={{
						strokeDasharray: `${fullLength}`,
						strokeDashoffset: `${readyToUse ? fillValue : `${fullLength}`}`,
						transition: animationDisabled || !readyToUse ? '' : `stroke-dashoffset ${animationTime}ms ${animationFn}`,
					}}
				/>
			</svg>
		</div>
	)
}
