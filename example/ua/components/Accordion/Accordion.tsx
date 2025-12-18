'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './Accordion.module.scss'

import React, {
	useEffect,
	useState,
	useRef,
	useMemo,
	memo,
	type ReactElement,
	type ReactNode,
	forwardRef,
	useImperativeHandle,
} from 'react'

import { ChevronUpIcon, MinusIcon, PlusIcon } from '../../icons'
import type { IconProps } from '../../icons/icons'
import { IconElement } from '../../icons/IconElement'
import { handleAccessibilityClick } from '../lib/util'

export interface AccordionPanelProps {
	/** The text for the title bar of the `Accordion` that is interactive to expand and collapse the component. */
	summary: string | ReactNode
	/** An extra class name to help target the content of the `AccordionDetails`. */
	className?: string
	/**
	 * Controls whether the panel is expanded. Updates reactively when changed by the parent.
	 */
	expanded?: boolean
	/** This will render the `Accordion` in different UX-defined themes. */
	theme?: 'large' | 'regular' | 'small'
	/** If set, this callback is fired when the Accordion is expanded */
	onExpand?: () => void
	/** If set, this callback is fired when the Accordion is collapsed */
	onCollapse?: () => void
	/** control to show the drop down arrow on the summary bar - setting this to false will minify the padding around the summary section to the children */
	showArrow?: boolean
	children: ReactNode
	/** This will disable the `Accordion` from expanding and collapsing */
	disabled?: boolean
}

interface AccordionActions {
	open: () => void
	close: () => void
}

type AccordionDetailElements =
	| ReactElement<AccordionPanelProps>
	| Array<ReactElement<AccordionPanelProps> | false | undefined>

export interface AccordionProps {
	/** The contents of the `Accordion` body */
	children: AccordionDetailElements
	/** An extra class name to help target the content of the `Accordion`. */
	className?: string
	/** This will render the `Accordion` in different UX-defined themes. */
	theme?: 'large' | 'regular' | 'small'
}

const AccordionHeading = ({ onClick, theme, showArrow, children, ...attrs }) => {
	const expandIcon = useMemo(() => {
		switch (theme) {
			case 'large':
				return [
					<IconElement key="closed-icon" data-open Icon={PlusIcon as React.NamedExoticComponent<IconProps>} />,
					<IconElement key="opened-icon" data-close Icon={MinusIcon as React.NamedExoticComponent<IconProps>} />,
				]
			default:
				return <IconElement Icon={ChevronUpIcon as React.NamedExoticComponent<IconProps>} />
		}
	}, [theme])

	return (
		<div
			role="button"
			tabIndex={0}
			className={`${styles['accordion--heading']} ua-accordion-heading ${
				!showArrow ? styles['accordion--heading-noarrow'] : ''
			}`}
			onClick={onClick}
			{...attrs}
			onKeyDown={(e) => handleAccessibilityClick(e, onClick)}
		>
			<div>{children}</div>
			{showArrow && <div className={styles['accordion--heading-icons']}>{expandIcon}</div>}
		</div>
	)
}

/**
 * UA Styled Accordion primitive that supports a single open and close container controlled
 * by the summary container.
 */
function AccordionBase({ children, className = '', theme = 'regular', ...attrs }: AccordionProps) {
	const childrenWithProps = useMemo(() => {
		const ensureChildrenArray = (Array.isArray(children) ? children.filter((child) => !!child) : [children]) as Array<
			ReactElement<AccordionPanelProps>
		>

		/**
		 * This allows us to extend the theme into the collection of Accordion Items so that any theme-level
		 * specifics, like icon being used, can be evaluated within the component. Icon rendering we want to
		 * conditionally show based on theme, and not simply leverage CSS to show/hide an array of icons being
		 * rendered.
		 */
		return React.Children.map(ensureChildrenArray, (child) => {
			return React.cloneElement(child, { theme })
		})
	}, [children, theme])

	const styleSize = useMemo(() => {
		switch (theme) {
			case 'small':
				return styles['accordion--container-small']
			case 'large':
				return styles['accordion--container-large']
			default:
				return ''
		}
	}, [theme])

	return (
		<div className={`${styles['accordion--container']} ${className} ${styleSize}`} {...attrs}>
			{childrenWithProps}
		</div>
	)
}

export const Accordion = memo(AccordionBase)

/**
 * Each `Accordion` must include one or many of these `AccordionPanel` components to compose the interactions
 * within the component.
 * NOTE: `theme` is passed through from the parent `Accordion` component, and should not be set on
 * each panel child, despite it being an optional prop.
 */
export const AccordionPanel = forwardRef<AccordionActions, AccordionPanelProps>(function AccordionPanel(
	{
		className = '',
		summary,
		theme,
		showArrow = true,
		expanded = false,
		children,
		disabled = false,
		onExpand,
		onCollapse,
		...attrs
	},
	ref,
) {
	const detailsContainerRef = useRef<HTMLDivElement>(null)
	const containerContentRef = useRef<HTMLDivElement>(null)
	const [isExpanded, setIsExpanded] = useState(expanded)

	useImperativeHandle(ref, () => ({
		open: () => {
			onExpand?.()
			setIsExpanded(true)
		},
		close: () => {
			onCollapse?.()
			setIsExpanded(false)
		},
	}))

	const toggleExpand = disabled
		? undefined
		: () => {
				if (!isExpanded) {
					onExpand?.()
				} else {
					onCollapse?.()
				}
				setIsExpanded(!isExpanded)
		  }

	// Fire toggleExpand whenever expanded prop changes
	useEffect(() => {
		if (expanded !== isExpanded) {
			toggleExpand?.()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [expanded])

	return (
		<div data-testid="accordion-detail" aria-expanded={isExpanded}>
			<AccordionHeading onClick={toggleExpand} theme={theme} showArrow={showArrow}>
				{summary}
			</AccordionHeading>
			<div
				role="region"
				data-testid="accordion-content-container"
				ref={detailsContainerRef}
				className={`${styles['accordion--details']} ua-accordion-details ${className}`}
				{...attrs}
			>
				<div data-testid="accordion-content" ref={containerContentRef}>
					{children}
				</div>
			</div>
		</div>
	)
})
