'use client'

/* ------------------ Component Styling Dependencies --------------------------- */
import styles from './Tabs.module.scss'

import React, { useCallback, useContext, useMemo, type PropsWithChildren, useEffect, useRef } from 'react'

/* -------------------- Local Context -------------------- */
interface TabsContextInterface {
	/** `index` of the initially selected `Tab` */
	initialTab: number
	idList: string[]
	/**
	 * @deprecated Use `onTabChange` instead.
	 *
	 * Do something when the tab changes
	 */
	handleTabChange?: (tabId: string) => void
	/** Do something when the tab changes */
	onTabChange?: (tabId: string) => void
}
const TabsContext = React.createContext<TabsContextInterface>({} as TabsContextInterface)
TabsContext.displayName = 'TabsContext'

/* -------------------- Primary Component -------------------- */
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Additional `class`es to add to the component */
	className?: string
	/** Completely overrides the component's `class`es for easier customization */
	classNameOverride?: string
	/** `index` of the initially selected `Tab` */
	initialTab?: TabsContextInterface['initialTab']
	/**
	 * @deprecated Use `onTabChange` instead.
	 *
	 * Do something when the tab changes
	 */
	handleTabChange?: (tabId: string) => void
	/** Do something when the tab changes */
	onTabChange?: (tabId: string) => void
	children: (
		| React.ReactElement<TabListProps>
		| React.ReactElement<TabPanelProps>
		| React.ReactElement<TabPanelProps>[]
	)[]
}

/**
 * Tabs organize content across different screens, data sets, and other interactions. This component renders the tabs
 * with minimal styling to enforce basic usage. Is can easily be overridden by styles, as we do across the application.
 */
export const Tabs = ({
	className = '',
	handleTabChange,
	onTabChange,
	classNameOverride,
	initialTab = 0,
	children,
	...attrs
}: TabsProps) => {
	const tabList = children.find((c) => !Array.isArray(c) && c.type === TabList) as React.ReactElement<TabListProps>
	const idListString = JSON.stringify(tabList.props.children.filter((c) => c).map((c) => c && c.props.id))
	const tabsContextValue = useMemo<TabsContextInterface>(
		() => ({
			initialTab,
			idList: JSON.parse(idListString),
			handleTabChange: handleTabChange ?? onTabChange,
		}),
		[initialTab, handleTabChange, onTabChange, idListString],
	)

	return (
		<TabsContext.Provider value={tabsContextValue}>
			<div className={classNameOverride ?? `${styles.tabs} ${className}`.trim()} {...attrs}>
				{tabList}
				<TabPanelList>{children.flat().filter((child) => child.type === TabPanel)}</TabPanelList>
			</div>
		</TabsContext.Provider>
	)
}

/* -------------------- TabList -------------------- */
interface TabListBaseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role' | 'onKeyDown'> {
	children: (React.ReactElement<TabProps> | false)[]
	selectedTabId?: string
}

type TabListProps = (TabListBaseProps & { 'aria-label': string }) | (TabListBaseProps & { 'aria-labelledby': string })

export function TabList({ children, selectedTabId, ...attrs }: TabListProps) {
	const currentTabList = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!selectedTabId) return

		// Change the focus to whatever tab is programmatically set by the parent
		const tabs = Array.from(currentTabList.current?.children as HTMLCollectionOf<HTMLButtonElement>)
		const selectedTab = tabs.find((tab) => tab.id === selectedTabId)
		selectedTab?.click()
	}, [selectedTabId])

	/** Manages the currently-focused `Tab` */
	function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
		const focusedTab = event.target as HTMLButtonElement
		const tabElements = Array.from(event.currentTarget.children as HTMLCollectionOf<HTMLButtonElement>)

		if (event.key === 'Home') tabElements[0].focus()
		else if (event.key === 'End') tabElements[tabElements.length - 1].focus()
		// Move Forward
		else if (event.key === 'ArrowRight') {
			if (focusedTab.nextSibling) (focusedTab.nextSibling as HTMLElement).focus()
			else tabElements[0].focus()
		}
		// Move Backward
		else if (event.key === 'ArrowLeft') {
			if (focusedTab.previousSibling) (focusedTab.previousSibling as HTMLElement).focus()
			else tabElements[tabElements.length - 1].focus()
		}
	}

	return (
		<div ref={currentTabList} role="tablist" onKeyDown={handleKeyDown} {...attrs}>
			{children}
		</div>
	)
}

/* -------------------- Tab -------------------- */
type RestrictedTabProps = 'type' | 'tabIndex' | 'role' | 'aria-controls' | 'aria-selected'
interface TabProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, RestrictedTabProps> {
	// TODO: Once we upgrade to `react@18`, BAN `id` prop and rely on `useId` hook instead for unique `id`s
	id: string
}

export const Tab = ({ children, onClick, ...attrs }: PropsWithChildren<TabProps>) => {
	// Derived Values
	const { initialTab, idList, handleTabChange, onTabChange } = useContext(TabsContext)
	const initiallySelected = attrs.id === idList[initialTab]
	const tabLabel = Array.isArray(children) ? children.join('') : children

	// Handlers
	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			changeTabs(event)
			onClick?.(event)
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[onClick],
	)

	function changeTabs(event: React.MouseEvent<HTMLButtonElement>) {
		const clickedTab = event.currentTarget
		const tabList = clickedTab.parentNode as ParentNode
		const tabsContainer = tabList.parentNode as ParentNode

		// Deselect all tabs and hide all tab panels
		tabList.querySelectorAll('[aria-selected="true"]').forEach((tab) => {
			tab.setAttribute('aria-selected', String(false))
			tab.setAttribute('tabindex', String(-1))
		})
		tabsContainer.querySelectorAll('[role="tabpanel"]').forEach((p) => p.setAttribute('hidden', String(true)))

		// Set this tab as selected and show its tab panel
		clickedTab.setAttribute('aria-selected', String(true))
		clickedTab.setAttribute('tabindex', String(0))
		;(tabsContainer.querySelector(`#${clickedTab.getAttribute('aria-controls')}`) as Element).removeAttribute('hidden')

		handleTabChange?.(clickedTab.id)
		onTabChange?.(clickedTab.id)
	}

	return (
		<button
			type="button"
			tabIndex={initiallySelected ? 0 : -1}
			role="tab"
			aria-controls={`${attrs.id}-panel`}
			aria-selected={initiallySelected}
			onClick={handleClick}
			{...attrs}
		>
			{tabLabel}
		</button>
	)
}

/* -------------------- Tab Panel List (Private) -------------------- */
interface TabPanelListProps {
	children: React.ReactElement<TabPanelProps>[]
}

/** Private helper component for initializing `TabPanel`s */
function TabPanelList({ children }: TabPanelListProps) {
	const { initialTab, idList } = useContext(TabsContext)

	return (
		<>
			{React.Children.map(children, (child, i) => (
				<child.type {...child.props} id={`${idList[i]}-panel`} aria-labelledby={idList[i]} hidden={i !== initialTab} />
			))}
		</>
	)
}

/* -------------------- Tab Panel -------------------- */
type RestrictedTabPanelProps = 'id' | 'role' | 'hidden' | 'aria-labelledby'
type TabPanelProps = React.PropsWithChildren<Omit<React.HTMLAttributes<HTMLDivElement>, RestrictedTabPanelProps>>

export function TabPanel({ children, ...attrs }: TabPanelProps) {
	return (
		<div role="tabpanel" {...attrs}>
			{children}
		</div>
	)
}
