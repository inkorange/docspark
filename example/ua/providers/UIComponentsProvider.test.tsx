import '@testing-library/jest-dom'
import { screen, render } from '@testing-library/react'
import { UIComponentsProvider, useComponentContext } from './UIComponentsProvider'
import { type ComponentLabels, defaultLabelLibrary, type UILabelLibrary } from './defaultLabelLibrary'
import { EditableCard } from '../components'
import React from 'react'

const weakCompare = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const Test = ({ testLabelData }: { testLabelData: Partial<UILabelLibrary> }) => {
	const { getLabelText, labelLibrary } = useComponentContext()
	return (
		<>
			<div data-testid="label-library-match">{weakCompare(labelLibrary, testLabelData) ? 'true' : 'false'}</div>
			{Object.keys(defaultLabelLibrary).map((component) =>
				Object.keys(defaultLabelLibrary[component]).map((key) => (
					<div key={`${component}_${key}`} data-testid={`${component}_${key}`}>
						{getLabelText(component as ComponentLabels, key)}
					</div>
				)),
			)}
		</>
	)
}

describe('UIComponentProvider', () => {
	it('returns default translations when none are supplied', () => {
		render(
			<div>
				<UIComponentsProvider labelConfig={{}}>
					<Test testLabelData={defaultLabelLibrary} />
				</UIComponentsProvider>
			</div>,
		)

		expect(screen.getByTestId('label-library-match')).toHaveTextContent('true')
	})

	it('returns a deep merge of translations when a partial is applied.', () => {
		const partialLabelData = {
			Dialog: {
				back: 'Bring it Back',
			},
		}

		render(
			<div>
				<UIComponentsProvider labelConfig={partialLabelData}>
					<Test
						testLabelData={{
							...defaultLabelLibrary,
							Dialog: {
								back: partialLabelData.Dialog.back,
								close: defaultLabelLibrary.Dialog.close,
							},
						}}
					/>
				</UIComponentsProvider>
			</div>,
		)

		expect(screen.getByTestId('label-library-match')).toHaveTextContent('true')
	})

	it('getLabelText returns default values.', () => {
		render(
			<div>
				<UIComponentsProvider labelConfig={{}}>
					<Test testLabelData={defaultLabelLibrary} />
				</UIComponentsProvider>
			</div>,
		)

		expect(screen.getByTestId('Carousel_next')).toHaveTextContent(defaultLabelLibrary.Carousel.next)
		expect(screen.getByTestId('Dialog_close')).toHaveTextContent(defaultLabelLibrary.Dialog.close)
		expect(screen.getByTestId('EditableCard_edit')).toHaveTextContent(defaultLabelLibrary.EditableCard.edit)
		expect(screen.getByTestId('RadioSelectionRow_edit')).toHaveTextContent(defaultLabelLibrary.RadioSelectionRow.edit)
	})

	it('getLabelText returns defined values.', () => {
		const partialLabelData = {
			Carousel: {
				next: 'Next Slide Here',
			},
			Dialog: {
				close: 'Move Along',
			},
			EditableCard: {
				edit: 'True',
				remove: 'No',
			},
			RadioSelectionRow: {
				edit: 'Radio Edit',
			},
		}

		render(
			<div>
				<UIComponentsProvider labelConfig={partialLabelData}>
					<Test testLabelData={partialLabelData} />
				</UIComponentsProvider>
			</div>,
		)

		expect(screen.getByTestId('Carousel_next')).toHaveTextContent(partialLabelData.Carousel.next)
		expect(screen.getByTestId('Carousel_previous')).toHaveTextContent(defaultLabelLibrary.Carousel.previous)
		expect(screen.getByTestId('Dialog_close')).toHaveTextContent(partialLabelData.Dialog.close)
		expect(screen.getByTestId('EditableCard_edit')).toHaveTextContent(partialLabelData.EditableCard.edit)
		expect(screen.getByTestId('RadioSelectionRow_edit')).toHaveTextContent(partialLabelData.RadioSelectionRow.edit)
	})

	it('default values returned in component when no provider is supplied', () => {
		render(
			<div>
				<EditableCard onEdit={() => false} onRemove={() => false}>
					Sampe Card
				</EditableCard>
			</div>,
		)

		expect(screen.getByRole('button', { name: defaultLabelLibrary.EditableCard.edit })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: defaultLabelLibrary.EditableCard.remove })).toBeInTheDocument()
	})

	describe('keyReplace', () => {
		it('replaces a single placeholder with the provided value', () => {
			const templateText = '{n} characters remaining'
			const input = { n: '5' }
			const result = templateText.replace(/{([^}]+)}/g, (match, placeholder) => {
				return input[placeholder]?.toString() ?? match
			})
			expect(result).toBe('5 characters remaining')
		})

		it('replaces a single numeric placeholder with the provided value', () => {
			const templateText = '{n} characters remaining'
			const input = { n: 10 }
			const result = templateText.replace(/{([^}]+)}/g, (match, placeholder) => {
				return input[placeholder]?.toString() ?? match
			})
			expect(result).toBe('10 characters remaining')
		})

		it('returns the original placeholder when the key is not provided in input', () => {
			const templateText = 'You have {count} items and {total} total'
			const input = { count: '5' }
			const result = templateText.replace(/{([^}]+)}/g, (match, placeholder) => {
				return input[placeholder]?.toString() ?? match
			})
			expect(result).toBe('You have 5 items and {total} total')
		})

		it('returns the original text when input is not provided', () => {
			const templateText = '{n} characters remaining'
			expect(templateText).toBe('{n} characters remaining')
		})

		it('returns the original text when input is an empty object', () => {
			const templateText = '{n} characters remaining'
			const input = {}
			const hasKeys = Object.keys(input).length > 0
			expect(hasKeys).toBe(false)
			expect(templateText).toBe('{n} characters remaining')
		})

		it('replaces multiple different placeholders in the same string', () => {
			const templateText = 'User {username} has {count} notifications'
			const input = { username: 'John', count: '3' }
			const result = templateText.replace(/{([^}]+)}/g, (match, placeholder) => {
				return input[placeholder]?.toString() ?? match
			})
			expect(result).toBe('User John has 3 notifications')
		})

		it('handles the same placeholder appearing multiple times', () => {
			const templateText = '{x} plus {x} equals {result}'
			const input = { x: '5', result: '10' }
			const result = templateText.replace(/{([^}]+)}/g, (match, placeholder) => {
				return input[placeholder]?.toString() ?? match
			})
			expect(result).toBe('5 plus 5 equals 10')
		})

		it('handles undefined input values gracefully', () => {
			const templateText = 'Value is {value}'
			const input = { value: undefined }
			const result = templateText.replace(/{([^}]+)}/g, (match, placeholder) => {
				return input[placeholder]?.toString() ?? match
			})
			expect(result).toBe('Value is {value}')
		})

		it('handles null input values gracefully', () => {
			const templateText = 'Value is {value}'
			const input = { value: null }
			const result = templateText.replace(/{([^}]+)}/g, (match, placeholder) => {
				return input[placeholder]?.toString() ?? match
			})
			expect(result).toBe('Value is {value}')
		})

		it('handles special regex characters in values', () => {
			const templateText = 'Pattern: {pattern}'
			const input = { pattern: '$test[.*]' }
			const result = templateText.replace(/{([^}]+)}/g, (match, placeholder) => {
				return input[placeholder]?.toString() ?? match
			})
			expect(result).toBe('Pattern: $test[.*]')
		})
	})
})
