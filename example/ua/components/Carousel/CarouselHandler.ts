import type { BreakpointOptions } from './Carousel'

export type Maybe<T> = null | undefined | T

export class CarouselHandler {
	private containerDOM: Maybe<HTMLDivElement>
	private itemsContainerDOM: Maybe<HTMLDivElement>
	private totalItemsWidth: number

	constructor() {
		this.containerDOM = null
		this.itemsContainerDOM = null
		this.totalItemsWidth = 0
	}

	public items: Maybe<NodeListOf<HTMLDivElement>>

	public resolveObjectDimensions(containerDOM, itemsContainerDOM) {
		this.containerDOM = containerDOM
		this.itemsContainerDOM = itemsContainerDOM
	}

	// eslint-disable-next-line class-methods-use-this
	public resolveBreakpointByScreen(breakpoints: BreakpointOptions, width): BreakpointOptions | null {
		let breakpointConfig
		const breakpointKeys = Object.keys(breakpoints).map((key) => Number(key))
		breakpointKeys
			.sort((a, b) => b - a)
			.forEach((breakpoint) => {
				if (width <= Number(breakpoint)) {
					breakpointConfig = breakpoints[breakpoint]
				}
			})
		return breakpointConfig
	}

	// eslint-disable-next-line class-methods-use-this
	public resolveTotalItemsWidth(items: NodeListOf<HTMLDivElement>) {
		let totalWidth = 0
		items.forEach((item) => (totalWidth += item.offsetWidth))
		return totalWidth
	}

	get carouselItems(): Maybe<NodeListOf<HTMLDivElement>> {
		if (this.items) {
			return this.items
		}
		const resolveItems: NodeListOf<HTMLDivElement> | undefined = this.itemsContainerDOM
			?.childNodes as NodeListOf<HTMLDivElement>
		if (resolveItems) {
			this.items = resolveItems
			this.totalItemsWidth = this.resolveTotalItemsWidth(resolveItems)
		}
		return this.items
	}

	get totalWidth(): number {
		return this.totalItemsWidth
	}
}
