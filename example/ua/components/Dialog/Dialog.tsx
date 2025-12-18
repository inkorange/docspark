'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './Dialog.module.scss'

import React, {
	forwardRef,
	type FunctionComponent,
	memo,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import CloseIcon from '../../icons/CloseIcon'
import { exposeRefTo } from '../actions'
import type { PolymorphicComponentProps } from '../../types'
import ChevronRightIcon from '../../icons/ChevronRightIcon'
import { useComponentContext } from '../../providers/UIComponentsProvider'
import type { IconProps } from '../../icons/icons'
import { useDeviceDetect } from '../../components/hooks/useDeviceDetect'

export interface DialogProps extends Omit<React.ComponentPropsWithRef<'dialog'>, 'onClick'> {
	/** Property that defines if the dialog is open */
	isModalOpen?: boolean
	/** Will toggle the action to close the dialog when the user clicks on the mask behind the dialog content */
	closeOnOutsideClick?: boolean
	/** Disables body scroll lock */
	disableScrollLock?: boolean
	/** Disable autofocus */
	disableAutofocus?: boolean
	/** Disables the escape key workaround for closing the dialog and use the browser's default handling instead (in future, consider removing escape key workaround) */
	disableEscapeKeyWorkaround?: boolean
	/** Shows a single open dialog at a time, instead of multiple stacked dialogs */
	singleVisible?: boolean
}

/**
 * Wrapper around the native `HTMLDialogElement` that should be `deprecated` after our minimum supported browser
 * versions support the native `dialog` element.
 */
const DialogBaseContainer = forwardRef<HTMLDialogElement | HTMLDivElement, DialogProps>(function DialogBase(
	{
		isModalOpen = false,
		children,
		className = '',
		closeOnOutsideClick = true,
		disableScrollLock = false,
		disableAutofocus = false,
		disableEscapeKeyWorkaround = false,
		singleVisible = false,
		...attrs
	},
	ref,
) {
	const dialog = useRef({} as HTMLDialogElement)
	const prevOpenDialogRef = useRef<HTMLDialogElement | null>(null) // The previous dialog that was open
	const { currentDevice } = useDeviceDetect()
	const { preventScroll, isScrollingDisabled, restoreScroll } = useComponentContext()

	/**
	 * Handles the visibility case when the component is completely destroyed, or lazy loaded.
	 */
	useEffect(() => {
		if (disableScrollLock) return
		if (dialog.current.open && !isScrollingDisabled(document.body)) {
			preventScroll()
		}
	}, [dialog.current?.open, currentDevice, disableScrollLock, isScrollingDisabled, preventScroll])

	useEffect(() => {
		if (disableScrollLock) return () => undefined

		/**
		 * Prevents background scrolling while the `dialog` is opened. Also responsible for automatically
		 * setting up the `dialog` {@link handlePolyfilledOutsideClick} event handler.
		 */
		const observer = new MutationObserver((mutationList) => {
			// eslint-disable-next-line consistent-return
			mutationList.forEach((mutation) => {
				const dialogBox = dialog.current
				if (mutation.type === 'attributes') {
					/**
					 * Only remove the overflow in the event that there are no open dialogs anywhere in the app.
					 */
					if (
						!dialogBox.hasAttribute('open') &&
						![...document.getElementsByTagName('dialog')].some((el) => el.hasAttribute('open'))
					) {
						return restoreScroll()
					}
					// for relative placement to top of page, we calculate and post the header height. Using offsetHeight to support desktop Safari, otherwise getBoundingClientRect().height is 0.
					const titleBoundingSize = (dialogBox.querySelector('[data-dialog-title]') as HTMLElement)?.offsetHeight
					const actionsBoundingSize = dialogBox.querySelector('[data-dialog-actions]')?.getBoundingClientRect()
					dialogBox.style.setProperty('--dialog-header-height', `${titleBoundingSize ?? 0}px`)
					dialogBox.style.setProperty('--dialog-actions-height', `${actionsBoundingSize?.height ?? 0}px`)

					if (!isScrollingDisabled(document.body)) {
						preventScroll()
					}
				} else if (mutation.type === 'childList') {
					mutation.addedNodes.forEach((node) => {
						// Type guard: Check if the node is an Element
						if (node.nodeType === Node.ELEMENT_NODE) {
							const elementNode = node as Element // Narrow to Element type

							if (elementNode.hasAttribute('data-dialog-title')) {
								const titleBoundingSize = (elementNode as HTMLElement)?.offsetHeight
								dialogBox.style.setProperty('--dialog-header-height', `${titleBoundingSize ?? 0}px`)
							}

							// Check if the added node has the 'data-dialog-actions' attribute
							if (elementNode.hasAttribute('data-dialog-actions')) {
								const actionsBoundingSize = elementNode.getBoundingClientRect()
								dialogBox.style.setProperty('--dialog-actions-height', `${actionsBoundingSize?.height ?? 0}px`)
							}
						}
					})
				}
			})
		})

		observer.observe(dialog.current, {
			attributes: true,
			attributeFilter: ['open'],
			childList: true,
			subtree: true,
		})

		return () => {
			observer.disconnect()

			// In case user navigates away via browser controls (back, forward) without closing caller panel (mobile nav, mobile search pane, etc)
			if (currentDevice && isScrollingDisabled(document.body)) {
				restoreScroll()
			}
		}
	}, [currentDevice, disableScrollLock, isScrollingDisabled, preventScroll, restoreScroll])

	useEffect(() => {
		// If undefined, then this dialog's open/close state is probably managed by a ref
		// using dialogRef.showModal() so do a quick exit
		if (isModalOpen === undefined) return
		const hasOpenAttribute = dialog.current.hasAttribute('open')
		if (isModalOpen && !hasOpenAttribute) {
			if (!dialog.current) return
			setTimeout(() => {
				// Get the previous open dialog if it exists
				const prevOpenDialog = [...document.querySelectorAll('dialog')].find(
					(el) => el.open && el.dataset.singleVisible === 'true' && el.style.display !== 'none',
				)
				if (disableAutofocus && dialog.current !== null) dialog.current.inert = true
				dialog.current?.showModal()
				if (disableAutofocus && dialog.current !== null) dialog.current.inert = false

				// If singleVisible is true, hide the previous open dialog
				if (singleVisible) {
					if (prevOpenDialog) {
						prevOpenDialogRef.current = prevOpenDialog
						prevOpenDialog.style.visibility = 'hidden'
					}
				}
			}, 1)
			return
		}

		if (!isModalOpen && hasOpenAttribute) {
			dialog.current.close()
		}
	}, [isModalOpen, disableAutofocus, singleVisible])

	useEffect(() => {
		const dialogCurrent = dialog.current
		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.stopImmediatePropagation()
				dialogCurrent.close()
			}
		}
		const handleClose = () => {
			// If singleVisible is true, show the previous open dialog during close
			if (prevOpenDialogRef.current) {
				prevOpenDialogRef.current.style.visibility = 'visible'
			}
		}
		if (!disableEscapeKeyWorkaround) document.body.addEventListener('keydown', handleKeydown)
		dialogCurrent?.addEventListener('close', handleClose)
		return () => {
			if (!disableEscapeKeyWorkaround) document.body.removeEventListener('keydown', handleKeydown)
			dialogCurrent?.removeEventListener('close', handleClose)
			handleClose()
		}
	}, [disableEscapeKeyWorkaround])

	return (
		// eslint-disable-next-line react/forbid-elements
		<dialog
			ref={exposeRefTo(dialog, ref)}
			aria-labelledby="dialog"
			role="dialog"
			data-testid="dialog-base"
			data-single-visible={singleVisible}
			onMouseDown={(e) => (closeOnOutsideClick ? handleOutsideClick(e) : false)}
			className={`${className} ${styles.dialog}`}
			{...attrs}
		>
			{children}
		</dialog>
	)
})

/** Handler to close the `dialog` when `dialog::backdrop` is clicked, but not the `dialog`'s true content */
function handleOutsideClick(event: React.MouseEvent<HTMLDialogElement>): void {
	if (event.target === event.currentTarget) event.currentTarget.close()
}

export const DialogBase = memo(DialogBaseContainer)

/* -------------------- Modular Components -------------------- */
type DialogSlotBaseProps = {
	children: NonNullable<React.ReactNode>
	/** Only Icons types with IconProps are able to be used here, which help enforce the sizing and color
	 * props exposed via that interface. */
	Icon?: FunctionComponent<IconProps>
}
interface DialogTitleSlotBaseProps extends DialogSlotBaseProps {
	onPrevious?: () => void
}
export type DialogSlotProps<E extends React.ElementType> = PolymorphicComponentProps<E, DialogSlotBaseProps>
export type DialogTitleSlotProps<E extends React.ElementType> = PolymorphicComponentProps<E, DialogTitleSlotBaseProps>

const IconElement = ({ Icon }: { Icon?: FunctionComponent<IconProps> }) => {
	return Icon ? <Icon className={styles['dialog-title--icon']} data-testid="dialog-title-icon" size="XXL" /> : <></>
}

/**
 * Slot container for the title element of the dialog component
 */
function Title<E extends React.ElementType>(
	{ as = 'h3' as E, children, Icon, onPrevious, className = '', ...attrs }: DialogTitleSlotProps<E>,
	ref: React.ForwardedRef<React.JSX.Element>,
): React.JSX.Element {
	const Element = as as React.ElementType
	const { getLabelText } = useComponentContext()
	return (
		<Element
			data-dialog-title
			className={`${styles['dialog-title--header']} ${Icon && styles['dialog-title--with-icon']} ${
				onPrevious && styles['dialog-title--with-navigation']
			} ${className}`}
			ref={ref}
			{...attrs}
		>
			{onPrevious && (
				<ChevronRightIcon
					aria-label={getLabelText('Dialog', 'back')}
					size="MD"
					onClick={onPrevious}
					className={styles['dialog-title--prev-action']}
				/>
			)}
			<IconElement Icon={Icon} />
			<span>{children}</span>
		</Element>
	)
}

function Content<E extends React.ElementType>(
	{ as = 'div' as E, className, ...attrs }: DialogSlotProps<E>,
	ref: React.ForwardedRef<HTMLElement>,
) {
	const Element = as as React.ElementType
	return (
		<Element
			data-dialog-content
			data-testid="dialog-content"
			className={`${styles['content-wrapper-content']} ${className}`}
			ref={ref}
			{...attrs}
		/>
	)
}

function Actions<E extends React.ElementType>(
	{ as = 'div' as E, className, ...attrs }: DialogSlotProps<E>,
	ref: React.ForwardedRef<HTMLElement>,
) {
	const Element = as as React.ElementType
	return (
		<Element
			data-dialog-actions
			data-testid="dialog-actions"
			className={`${styles['content-wrapper-actions']} ${className}`}
			ref={ref}
			{...attrs}
		/>
	)
}

export interface DialogLayoutProps extends DialogProps {
	children?: [React.ReactElement, React.ReactElement, React.ReactElement] | ReactNode
	/** if false, it will not show the close button icon in the upper-right */
	showCloseIcon?: boolean
	/** This option handles if the modal should close when the user clicks outside the dialog content. */
	closeOnOutsideClick?: boolean
	/** In some instances, the designs call for no padding around the dialog content, this enforces that preference. */
	borderless?: boolean
	/** Option to enforce a full screen rendering of the dialog content */
	fullscreen?: boolean
	/** Disables body scroll lock */
	disableScrollLock?: boolean
	onClose?: (e: React.MouseEvent<HTMLDialogElement>) => void
}

type DialogComponentType = DialogLayoutProps

interface DialogSlotContent {
	title?: ReactNode
	content?: ReactNode[]
	actions?: ReactNode
}

/**
 * Core interaction handler wrapping the native `HTMLDialogElement` element.
 *
 * **Localization Considerations:**
 *
 * This component requires localized text primarily for accessibility considerations for the close and back buttons rendered within the `Dialog.Title` section.
 *
 * This is configured via the `labelConfig` prop in `UAComponentsProvider` under the following object:
 * ```typescript
 * Dialog: {
 *     back: 'back',
 *     close: 'close',
 * }
 * ```
 */
const DialogCore = memo(
	forwardRef<HTMLDialogElement, DialogComponentType>(function Dialog(
		{
			children,
			className = '',
			showCloseIcon = true,
			borderless = false,
			closeOnOutsideClick = true,
			fullscreen = false,
			disableScrollLock = false,
			onClose,
			...attrs
		},
		ref,
	) {
		const dialog = useRef({} as HTMLDialogElement)
		const [dialogContent, setDialogContent] = useState<DialogSlotContent>({})
		const [hasChildSlots, setHasChildSlots] = useState(false)

		const handleCloseButton = (e): void => {
			dialog.current.close()
			if (onClose) onClose(e)
		}

		const getSlotType = (child) => {
			return child?.type?.displayName
		}

		const getDialogContent = useCallback(() => {
			const dialogContentObj: DialogSlotContent = {}
			const contentItem: ReactNode[] = []

			if (Array.isArray(children)) {
				React.Children.forEach(children, (child) => {
					const slotName = getSlotType(child)
					if (slotName === 'Dialog.Title') {
						dialogContentObj.title = child
					} else if (slotName === 'Dialog.Actions') {
						dialogContentObj.actions = child
					} else {
						contentItem.push(child)
					}
				})
			} else {
				contentItem.push(children)
			}
			setHasChildSlots(true) // TODO: Needs to resolve this value appropriately.
			return {
				...dialogContentObj,
				content: contentItem,
			}
		}, [children])

		const handleBaseClose = (e: React.MouseEvent<HTMLDialogElement>) => {
			e.stopPropagation()
			if (onClose) onClose(e)
		}

		useEffect(() => {
			setDialogContent(getDialogContent)
		}, [getDialogContent, children])

		/** TODO: get a better read on the usage of Slots vs legacy Dialog usage. Currently we are not resolving
		 *   the Slots nested in a Fragment on some Dialogs, IE: UserActionModal Login
		 *   we need to conditionally show this class if there are no slots: `content-wrapper--default`
		 */
		return (
			<DialogBase
				className={`
					${styles['dialog--ua-dialog']}
					${borderless ? styles['dialog--ua-dialog-noborder'] : ''}
					${fullscreen ? styles['dialog--ua-dialog-fullscreen'] : ''}
					${className}
				`}
				ref={exposeRefTo(dialog, ref)}
				closeOnOutsideClick={closeOnOutsideClick}
				onClose={handleBaseClose}
				disableScrollLock={disableScrollLock}
				{...attrs}
			>
				<div className={styles['dialog--ua-dialog--content']}>
					{showCloseIcon && <DialogCloseButton onCloseClick={handleCloseButton} />}
					<div className={`${styles['content-wrapper']} ${!hasChildSlots ? [styles['content-wrapper--default']] : ''}`}>
						{dialogContent?.title}
						{dialogContent?.content}
						{dialogContent?.actions}
					</div>
				</div>
			</DialogBase>
		)
	}),
)

type ForwardRefComponent<T, P> = React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<T>>

type DialogWithSlotsType = React.NamedExoticComponent<DialogLayoutProps> & {
	Title: ForwardRefComponent<React.JSX.Element, DialogTitleSlotProps<React.ElementType>> & { displayName: string }
	Content: ForwardRefComponent<HTMLElement, DialogSlotProps<React.ElementType>> & { displayName: string }
	Actions: ForwardRefComponent<HTMLElement, DialogSlotProps<React.ElementType>> & { displayName: string }
}
const DialogWithSlots: DialogWithSlotsType = Object.assign(DialogCore, {
	Title: memo(forwardRef(Title)) as ForwardRefComponent<React.JSX.Element, DialogTitleSlotProps<React.ElementType>> & {
		displayName: string
	},
	Content: memo(forwardRef(Content)) as ForwardRefComponent<HTMLElement, DialogSlotProps<React.ElementType>> & {
		displayName: string
	},
	Actions: memo(forwardRef(Actions)) as ForwardRefComponent<HTMLElement, DialogSlotProps<React.ElementType>> & {
		displayName: string
	},
})
DialogWithSlots.displayName = 'Dialog'
DialogWithSlots.Title.displayName = 'Dialog.Title'
DialogWithSlots.Content.displayName = 'Dialog.Content'
DialogWithSlots.Actions.displayName = 'Dialog.Actions'

export const Dialog = DialogWithSlots

/**
 * Dialog-based close button component
 * @param onCloseClick
 */
function DialogCloseButton({ onCloseClick }) {
	const { getLabelText } = useComponentContext()
	return (
		<button
			type="button"
			className={styles['close-button']}
			data-testid="dialog-close-button"
			aria-label={getLabelText('Dialog', 'close')}
			onClick={onCloseClick}
		>
			<CloseIcon size="SM" />
			<span className="visually-hidden">{getLabelText('Dialog', 'close')}</span>
		</button>
	)
}
