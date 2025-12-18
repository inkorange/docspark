'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './DropMenu.module.scss'

import React, { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react'

import ArrowDropDownIcon from '../../icons/ArrowDropDownIcon'
import ArrowDropUpIcon from '../../icons/ArrowDropUpIcon'
import useToggle from '../hooks/useToggle'

type DropMenuOptionProps = {
	children: React.ReactNode
	[x: string]: unknown
}

export const DropMenuOption = ({ children, ...props }: DropMenuOptionProps) => <li {...props}>{children}</li>

interface DropMenuProps {
	/** The label text to show that will be clicked to trigger the menu to open/close */
	buttonLabel: React.ReactNode
	header?: React.ReactNode
	className?: string
	children:
		| ReactNode
		| React.ReactElement<DropMenuOptionProps>[]
		| React.ReactElement<DropMenuOptionProps>
		| ((
				setToggleActive: () => void,
		  ) => React.ReactElement<DropMenuOptionProps>[] | React.ReactElement<DropMenuOptionProps>)
	/** Considered a unique identifier to insert accessibility tagging for the component. */
	name: string
	/** Callback function when the element is clicked and opens up the drop menu */
	onOpen?: () => void
	/** Callback function when the element has closed the drop menu */
	onClose?: () => void
}

export const DropMenu = ({ buttonLabel, children, name, header, onOpen, onClose, className = '' }: DropMenuProps) => {
	const { value: isActive, handleToggle, handleClose } = useToggle(false)
	const handleDropMenuToggle = useCallback(() => {
		if (!isActive && onOpen) onOpen()
		handleToggle()
	}, [handleToggle, isActive, onOpen])

	const handleDropMenuClose = useCallback(() => {
		onClose?.()
		handleClose()
	}, [handleClose, onClose])

	const dropdownAccessibilityOptions = useMemo(
		() => ({
			buttonId: `${name}-switcher`,
			dropdownId: `${name}-dropdown`,
			buttonDataTestId: `${name}-switcher`,
			dropdownDataTestId: `${name}-switcher-menu`,
			ariaControls: `${name}-dropdown`,
			iconDataTestId: `${name}-menu-icon`,
		}),
		[name],
	)

	const dropdownRef = useRef<HTMLDivElement>(null)

	// This useEffect is used to close the dropdown when clicking outside of it.
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				handleDropMenuClose()
			}
		}

		if (isActive) {
			document.addEventListener('mousedown', handleClickOutside)
		} else {
			document.removeEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isActive, handleDropMenuClose])

	const optionContent = useMemo((): ReactNode => {
		return typeof children === 'function' ? children(handleDropMenuClose) : children
	}, [children, handleDropMenuClose])

	return (
		<div className={`${styles.dropdown} ${isActive ? styles.dropdown__backdrop : ''} ${className}`}>
			<button
				type="button"
				className={styles.dropdown__button}
				id={dropdownAccessibilityOptions.buttonId}
				data-testid={dropdownAccessibilityOptions.buttonDataTestId}
				aria-controls={dropdownAccessibilityOptions.ariaControls}
				aria-haspopup="true"
				aria-expanded={isActive ? 'true' : 'false'}
				onClick={handleDropMenuToggle}
			>
				{buttonLabel}
				{isActive ? (
					<ArrowDropUpIcon
						size="SM"
						color="var(--color-white)"
						data-testid={dropdownAccessibilityOptions.iconDataTestId}
					/>
				) : (
					<ArrowDropDownIcon
						size="SM"
						color="var(--color-white)"
						data-testid={dropdownAccessibilityOptions.iconDataTestId}
					/>
				)}
			</button>
			<div
				ref={dropdownRef}
				className={isActive ? styles.dropdown__options : styles.dropdown__hidden}
				id={dropdownAccessibilityOptions.dropdownId}
				data-testid={dropdownAccessibilityOptions.dropdownDataTestId}
			>
				{header}
				{optionContent}
			</div>
		</div>
	)
}
