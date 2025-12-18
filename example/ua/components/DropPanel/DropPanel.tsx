'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './DropPanel.module.scss'

import React, { type ReactNode, useCallback, useRef } from 'react'

import useToggle from '../hooks/useToggle'
import { Accordion, AccordionPanel } from '../Accordion/Accordion'

interface DropPanelProps {
	/** The label text to show that will be clicked to trigger the menu to open/close */
	buttonLabel: React.ReactNode
	/** Defines if the panel should be fixed to the top of the page, or be inline */
	inline?: boolean
	children: ReactNode
	className?: string
	/** Callback function when the element is clicked and opens up the drop menu */
	onOpen?: () => void
	/** Callback function when the element has closed the drop menu */
	onClose?: () => void
	/** Will show the up|down arrow indicator in the header */
	showArrow?: boolean
}

/**
 * DropPanel is a composed navigational element that is used primarily on mobile layouts.
 * It has controls that allows it to be fixed to the top of the page as a static menu item, but it can
 * also render inline, as well as be nested. It relies on the composition of the `Accordion` component and extends it's
 * visual handling to abide by the design system for it's purpose.
 *
 * When the panel is opened up on fixed mode (default), it will prevent scrolling on the body of the page, similar to how the `Dialog` component works.
 * Clicking the mask below the panel will close the menu.
 */
export const DropPanel = ({
	buttonLabel,
	inline = false,
	children,
	onOpen,
	onClose,
	showArrow,
	className = '',
}: DropPanelProps) => {
	const { value: isActive, handleToggle, handleClose } = useToggle(false)
	const accordionRef = useRef(null)
	const handleMenuClose = useCallback(() => {
		onClose?.()
		handleClose()
		if (!inline) document.body.style.overflow = 'auto'
	}, [handleClose, onClose, inline])

	const handleMenuOpen = useCallback(() => {
		onOpen?.()
		handleToggle()
		if (!inline) document.body.style.overflow = 'hidden'
	}, [handleToggle, onOpen, inline])

	const handlePanelClose = () => {
		accordionRef.current?.close()
	}

	return (
		<div className={`${styles.dropPanel} ${inline ? styles.inline : ''} ${className}`}>
			<div
				className={`${styles['dropPanel--screen']} ${isActive ? styles['dropPanel--screen-show'] : ''}`}
				onClick={handlePanelClose}
			/>
			<Accordion className={`${styles['dropPanel--details']} dropPanel--container`}>
				<AccordionPanel
					ref={accordionRef}
					showArrow={showArrow}
					summary={<summary>{buttonLabel}</summary>}
					onExpand={handleMenuOpen}
					onCollapse={handleMenuClose}
				>
					{children}
				</AccordionPanel>
			</Accordion>
		</div>
	)
}
