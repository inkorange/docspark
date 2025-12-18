'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './Popup.module.scss'

import { useEffect, useCallback } from 'react'

import useToggle from '../hooks/useToggle'
import { Tooltip, type ToolTipProps } from '../Tooltip/Tooltip'

export interface PopupProps extends ToolTipProps {
	/** boolean to trigger close functionality from parent */
	forceCloseModal?: boolean

	/** The primary content of the Popup component */
	body: string | React.ReactNode

	/** callback function to call once the modal is closed */
	onClose?: () => void

	/** Additional class names for the Popup */
	className?: string

	/** Even if the tooltip is spawned off the viewport, ignore correcting it */
	force?: boolean

	/** Body content of the Popup  */
	children?: React.ReactNode
}

/**
 * The `Popup` component wraps the `Tooltip` component for a more controlled visibility design pattern controlled when
 * the element is clicked on. When the target element is clicked, the pop-up will remain visible until the
 * user hits the escape key or blurs off the focused target. The Modal menu internally utilizes the Tooltip component
 * inheriting the styling from the `Tooltip` component
 */
export const Popup = ({ children, forceCloseModal = false, body, onClose, className = '', ...attrs }: PopupProps) => {
	const { value: isModalActive, handleToggle, handleClose } = useToggle(false)

	const handleModalClose = useCallback(() => {
		handleClose()
		if (onClose) {
			onClose()
		}
	}, [handleClose, onClose])

	useEffect(() => {
		handleModalClose()
	}, [forceCloseModal, handleModalClose])

	return (
		<>
			{isModalActive && <div className={styles['modal-overlay']} onClick={handleModalClose} />}
			<Tooltip
				className={`${styles.popup} ${className}`}
				disableTooltipOnHover
				onToggle={handleToggle}
				data-popup-visibility={isModalActive}
				body={body}
				{...attrs}
			>
				{children}
			</Tooltip>
		</>
	)
}
