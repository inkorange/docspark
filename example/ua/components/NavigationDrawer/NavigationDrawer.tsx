'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './NavigationDrawer.module.scss'

import { useCallback, useEffect, useState, type PropsWithChildren } from 'react'
import CloseIcon from '../../icons/CloseIcon'
import { IconButton } from '../IconButton/IconButton'
import { useComponentContext } from '../../providers/UIComponentsProvider'

interface NavigationDrawerProps {
	/** Extend the base div element's class styles */
	className?: string
	/** Controls if the drawer is opened or closed, operating as a controlled component. */
	open?: boolean
	/** Controls whether the close button is shown in the `NavigationDrawer`. */
	showClose?: boolean
	/** When enabled, clicking on the overlay will close the drawer. */
	closeOnBlur?: boolean
	/** When enabled, clicking the Escape key will close the drawer */
	closeOnEscape?: boolean
	/** Callback when the drawer is opened. */
	onOpen?: () => void
	/** Callback when the drawer is closed. */
	onClose?: () => void
	/** Renders the drawer to be launched from either the left or right side, left is default. */
	direction?: 'left' | 'right'
	/** Disables body scroll lock */
	disableScrollLock?: boolean
	/** If populated, this will render the title above the content within the `NavigationDrawer`. */
	title?: React.JSX.Element | string
}

/**
 * The NavigationDrawer is a full-page rendered menu that is managed by an external handler to show/hide the panel.
 * The drawer can be spawned from either the left or right side of the page, and has baked in responsive handling
 * that enforces the design system based on resolution.
 */
export const NavigationDrawer = ({
	children,
	open = false,
	showClose = true,
	closeOnBlur = true,
	closeOnEscape = true,
	onOpen,
	onClose,
	className = '',
	direction = 'left',
	disableScrollLock = false,
	title,
	...attrs
}: PropsWithChildren<NavigationDrawerProps>) => {
	const [isOpen, setIsOpen] = useState(open)
	const { preventScroll, isScrollingDisabled, restoreScroll } = useComponentContext()

	useEffect(() => {
		if (open !== isOpen) {
			setIsOpen(open)
			if (open) {
				if (!disableScrollLock && !isScrollingDisabled(document.body)) preventScroll()
				onOpen?.()
			} else if (isScrollingDisabled(document.body)) {
				restoreScroll()
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen, onOpen, open])

	const handleCloseDrawer = useCallback(() => {
		if (!isOpen) return
		if (isScrollingDisabled(document.body)) restoreScroll()
		setIsOpen(false)
		onClose?.()
	}, [isOpen, onClose, restoreScroll, isScrollingDisabled])

	useEffect(() => {
		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.stopImmediatePropagation()
				handleCloseDrawer()
			}
		}

		if (closeOnEscape) document.body.addEventListener('keydown', handleKeydown)

		return () => {
			if (closeOnEscape) document.body.removeEventListener('keydown', handleKeydown)
		}
	}, [closeOnEscape, handleCloseDrawer])

	return (
		<>
			<div
				className={styles['nav-drawer-overlay']}
				data-open={isOpen}
				role="presentation"
				aria-hidden={!isOpen}
				onClick={closeOnBlur ? handleCloseDrawer : undefined}
			/>
			<nav className={`${styles['nav-menu']} ${className}`} data-open={isOpen} data-direction={direction} {...attrs}>
				{showClose && (
					<IconButton
						icon={CloseIcon}
						className={styles['nav-menu--close']}
						label={'Close Navigation Menu'}
						onClick={handleCloseDrawer}
					/>
				)}

				{title && <h2 className={styles['nav-menu--title']}>{title}</h2>}
				<div className={styles['nav-menu--content']}>{children}</div>
			</nav>
		</>
	)
}
