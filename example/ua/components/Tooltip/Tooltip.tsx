'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './Tooltip.module.scss'

import React, { useCallback, useEffect, useId, useRef, useState, useMemo } from 'react'
import { useDebouncedCallback } from '../hooks/useDebouncedCallback'
import { useIsomorphicLayoutEffect } from '../lib/staticHookHandlers'
import QuestionCircleIcon from '../../icons/QuestionCircleIcon'
import InfoCircleIcon from '../../icons/InfoCircleIcon'

export type LocationDirection = 'top' | 'bottom' | 'left' | 'right'

export interface ToolTipProps {
	className?: string
	/** The type of icon to render (alternative to `children`). Defaults to `question` */
	icon?: 'question' | 'info'

	/** The **bold** title to use for the `tooltip` */
	title?: string

	/** The primary content of the `tooltip` */
	body: string | React.ReactNode

	/** The location of the `tooltip` _content_. Defaults to `bottom` */
	location?: LocationDirection

	/** Even if the tooltip is spawned off the viewport, ignore correcting it */
	force?: boolean

	/** When supplied, will render instead of the icon */
	children?: React.ReactNode

	/** tooltip show/hide on hover is controlled from the parent - default is false  */
	disableTooltipOnHover?: boolean

	/** callback Function to handle tooltip toggle */
	onToggle?: () => void
}

export const Tooltip = function Tooltip({
	className,
	icon = 'question',
	title,
	body,
	location = 'bottom',
	force = false,
	children,
	disableTooltipOnHover = false,
	onToggle,
	...attrs
}: ToolTipProps) {
	const id = useId()
	const tooltipRef = useRef<HTMLDivElement>(null)
	const [offsetTooltip, setOffsetTooltip] = useState<{
		x: number | undefined
		y: number | undefined
		left: number | undefined
	}>({ x: undefined, y: undefined, left: undefined })
	const [spawnLocation, setSpawnLocation] = useState<LocationDirection>(location)

	/**
	 * Function to determine if the tooltip is situated off the current viewport, and apply inline
	 * styling to correct the position so that we prevent page overflow issues.
	 */
	const handleRePositioning = useCallback(() => {
		if (!tooltipRef.current || force) {
			setSpawnLocation(location)
			return
		}
		const tooltipBCRect = tooltipRef.current.getBoundingClientRect()
		const windowWidth = Math.min(window.innerWidth, window.outerWidth)
		const windowHeight = window.innerHeight
		let xOffset
		let leftOffset
		let spawnLocationValue = location

		// tooltip is going off the top of the screen, will swap to a bottom position
		if (tooltipBCRect.top < 0) {
			spawnLocationValue = 'bottom'
		} else if (tooltipBCRect.top + tooltipBCRect.height > windowHeight) {
			spawnLocationValue = 'top'
		}
		// tooltip is going off the right side of the viewPort
		if (tooltipBCRect.left + tooltipBCRect.width > windowWidth) {
			xOffset = 0
			leftOffset = `calc(${windowWidth - (tooltipBCRect.left + tooltipBCRect.width)}px + var(--spacing-2xs))`
			// tooltip is going off the left side of the viewPort
		} else if (tooltipBCRect.left < 0) {
			xOffset = 0
			leftOffset = `calc(${tooltipBCRect.left * -1}px + var(--spacing-xs))`
		}
		setSpawnLocation(spawnLocationValue)
		setOffsetTooltip({
			x: xOffset,
			y: 0,
			left: leftOffset,
		})
	}, [force, location])

	useIsomorphicLayoutEffect(() => {
		if (offsetTooltip.x === undefined && offsetTooltip.y === undefined) {
			handleRePositioning()
		}
	}, [handleRePositioning, offsetTooltip])

	const handleLocationReset = useDebouncedCallback(() => {
		setSpawnLocation(location)
		setOffsetTooltip({
			x: undefined,
			y: undefined,
			left: undefined,
		})
	}, 100)

	useEffect(() => {
		window.addEventListener('resize', handleLocationReset)
		return () => {
			window.removeEventListener('resize', handleLocationReset)
		}
	}, [handleLocationReset])

	const tooltipRepositionStyle = {
		// TODO: Implement a transform when we have offset for x other than 0 or undefined
		/* transform:
			offsetTooltip.x && !force ? `translateX(${offsetTooltip.x}px) translateY(${offsetTooltip.y}px)` : undefined, */
		left: offsetTooltip.left && !force ? offsetTooltip.left : undefined,
	}

	const IconElement = useMemo(() => {
		switch (icon) {
			case 'info':
				return InfoCircleIcon
			default:
				return QuestionCircleIcon
		}
	}, [icon])

	/*
	 * TODO: Need to consider accessibility approach for "non-tooltip 'tooltips'".
	 * See https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role
	 */
	return (
		<div className={`${styles.tooltip} ${className}`} data-testid="tooltip" data-location={spawnLocation} data-tooltip>
			<button
				type="button"
				aria-describedby={id}
				onMouseOver={handleLocationReset}
				onKeyDown={handleKeyDown}
				onClick={(e) => handleClick(e, onToggle)}
				onBlur={handleBlur}
				className={`${disableTooltipOnHover ? styles['disable-tooltip-on-hover'] : ''}`}
				{...attrs}
			>
				{children || <IconElement size="SM" />}
				<div data-tooltip-arrow className={styles['tooltip-arrow']} />
			</button>
			<div id={id} style={tooltipRepositionStyle} ref={tooltipRef} role="tooltip" tabIndex={0}>
				{!!title && <div className={styles['tooltip--title']}>{title}</div>}
				{body}
			</div>
		</div>
	)
}

function handleKeyDown(event: React.KeyboardEvent<HTMLElement>): void {
	if (event.key !== 'Escape') return
	event.currentTarget.blur()
	const tooltip = document.getElementById(event.currentTarget.getAttribute('aria-describedby') as string) as HTMLElement
	tooltip.hidden = true
}

function handleClick(event: React.MouseEvent<HTMLElement>, onToggle: () => void): void {
	const tooltip = document.getElementById(event.currentTarget.getAttribute('aria-describedby') as string) as HTMLElement
	if (tooltip) {
		tooltip.hidden = false
		onToggle?.()
	}
}

function handleBlur(event: React.FocusEvent<HTMLElement>): void {
	const tooltip = document.getElementById(event.currentTarget.getAttribute('aria-describedby') as string) as HTMLElement
	if (tooltip) tooltip.hidden = false
}
