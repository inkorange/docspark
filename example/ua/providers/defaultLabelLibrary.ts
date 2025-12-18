export type ComponentLabels =
	| 'Carousel'
	| 'Dialog'
	| 'Button'
	| 'EditableCard'
	| 'PasswordField'
	| 'RadioSelectionRow'
	| 'InputField'
export type UILabelLibrary = Record<ComponentLabels, Record<string, string>>
export const defaultLabelLibrary: UILabelLibrary = {
	Carousel: {
		next: 'Next Slide',
		previous: 'Previous Slide',
	},
	Dialog: {
		back: 'back',
		close: 'Close Dialog',
	},
	Button: {
		loading: 'Loading...',
	},
	EditableCard: {
		card: 'Card',
		edit: 'Edit',
		remove: 'Remove',
	},
	PasswordField: {
		show: 'Show',
		hide: 'Hide',
	},
	RadioSelectionRow: {
		edit: 'Edit',
	},
	InputField: {
		'characters-remaining': 'characters remaining',
	},
}
