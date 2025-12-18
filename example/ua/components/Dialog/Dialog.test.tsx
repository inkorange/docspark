import '@testing-library/jest-dom'

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogBase } from './Dialog'
import { AlertCircleIcon } from '../../icons'

describe('Dialog', () => {
	describe('Basic Scaffolding Rendering', () => {
		it('Correctly UPDATES any React Refs that it receives', async () => {
			let dialogReference: React.MutableRefObject<HTMLDialogElement> | undefined

			function TestEnvironment() {
				const dialog = useRef({} as HTMLDialogElement)
				useEffect(() => (dialogReference = dialog) && undefined, [])
				const [on, toggleOn] = useState(false)

				return (
					<>
						<button type="button" onClick={() => toggleOn((o) => !o)}>
							Toggle State
						</button>
						{on && (
							<Dialog ref={dialog} isModalOpen={true}>
								Hello!
							</Dialog>
						)}
					</>
				)
			}

			// No Dialog `ref` initially
			render(<TestEnvironment />)
			expect((dialogReference as NonNullable<typeof dialogReference>).current).toStrictEqual({})

			// Dialog `ref` should exist after the state is toggled "ON"
			await userEvent.click(screen.getByRole('button'))
			const renderedDialog = screen.getByRole('dialog')
			expect((dialogReference as NonNullable<typeof dialogReference>).current).toBe(renderedDialog)

			// Dialog `ref` should no longer exist after the state is toggled "OFF"
			await userEvent.click(screen.getByRole('button', { name: 'Toggle State' }))
			expect((dialogReference as NonNullable<typeof dialogReference>).current).toBe(null)
		})

		it('Correctly CALLS any React Ref Callbacks that it receives', async () => {
			const dialogRefCallback = jest.fn()

			function TestEnvironment() {
				const [on, toggleOn] = useState(false)

				return (
					<>
						<button type="button" onClick={() => toggleOn((o) => !o)}>
							Toggle State
						</button>
						{on && (
							<Dialog ref={dialogRefCallback} isModalOpen={true}>
								Hello!
							</Dialog>
						)}
					</>
				)
			}

			// `refCallback` should not have been called initially because the component was not rendered
			render(<TestEnvironment />)
			const launchButton = screen.getByRole('button', { name: 'Toggle State' })
			expect(dialogRefCallback).not.toHaveBeenCalled()

			// Dialog `ref` should be passed after the state is toggled "ON"
			await userEvent.click(launchButton)
			const renderedDialog = screen.getByRole('dialog')
			expect(dialogRefCallback).toHaveBeenNthCalledWith(1, renderedDialog)

			// `null` should be passed after the state is toggled "OFF"
			await userEvent.click(launchButton)
			expect(dialogRefCallback).toHaveBeenNthCalledWith(2, null)
		})
	})

	describe('Slot Handling', () => {
		it('Renders a (legacy) `dialog` element without any slots being supplied', async () => {
			const testClass = 'my-test-class'
			const testText = 'My Test Text'

			render(
				<Dialog className={testClass} isModalOpen={true}>
					{testText}
				</Dialog>,
			)
			let dialog
			await waitFor(() => {
				expect(screen.getByRole('dialog')).toBeVisible()
				dialog = screen.getByRole('dialog')
			})

			expect(dialog.tagName).toBe('DIALOG')
			expect(dialog).toHaveAttribute('open')
			expect(dialog).toBeVisible()
			expect(dialog).toHaveTextContent(testText)
			expect(dialog).toHaveClass(testClass)
		})

		it('Renders a `dialog` element with supplied slots', async () => {
			render(
				<Dialog isModalOpen={true}>
					<Dialog.Title>Title Text</Dialog.Title>
					<Dialog.Content>This is the dialog content.</Dialog.Content>
					<Dialog.Actions>
						<button type="button">Close</button>
					</Dialog.Actions>
				</Dialog>,
			)
			await waitFor(() => expect(screen.getByRole('heading')).toHaveTextContent('Title Text'))
			expect(screen.queryByTestId('dialog-title-icon')).not.toBeInTheDocument()
			expect(screen.getByTestId('dialog-content')).toHaveTextContent('This is the dialog content.')
			expect(screen.getByTestId('dialog-actions')).toHaveTextContent('Close')
		})

		it('Renders the close icon correctly with onClose callback', async () => {
			const onCloseMockFn = jest.fn()
			render(
				<Dialog onClose={onCloseMockFn} isModalOpen={true}>
					<Dialog.Title>Title Text</Dialog.Title>
					<Dialog.Actions>
						<button type="button">Close</button>
					</Dialog.Actions>
				</Dialog>,
			)
			const closeButton = screen.getByLabelText('Close Dialog')
			await waitFor(() => expect(closeButton).toBeInTheDocument())
			await userEvent.click(closeButton)
			expect(onCloseMockFn).toHaveBeenCalled()
		})

		it('Renders the title icon correctly via the slot variant', async () => {
			render(
				<Dialog isModalOpen={true}>
					<Dialog.Title Icon={AlertCircleIcon}>Title Text</Dialog.Title>
					<Dialog.Actions>
						<button type="button">Close</button>
					</Dialog.Actions>
				</Dialog>,
			)

			await waitFor(() => expect(screen.getByRole('heading')).toHaveTextContent('Title Text'))
			expect(screen.getByTestId('dialog-title-icon')).toBeInTheDocument()
		})
	})
})

describe('DialogBase', () => {
	describe('Basic dialog functionality', () => {
		beforeEach(() => {
			window.scrollTo = jest.fn()
		})

		it('Calls onClose when backdrop clicked', async () => {
			const handleOnClose = jest.fn()
			const { rerender } = render(<DialogBase isModalOpen />)
			let backdrop = screen.getByRole('dialog', { hidden: true })
			await userEvent.click(backdrop)
			rerender(<DialogBase isModalOpen={true} onClose={handleOnClose} />)
			backdrop = screen.getByRole('dialog', { hidden: true })
			await userEvent.click(backdrop)
			expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open')
		})

		it('Does not call onClose when backdrop clicked when closeOnOutsideClick is false', async () => {
			const handleOnClose = jest.fn()
			const { rerender } = render(<DialogBase isModalOpen closeOnOutsideClick={false} />)
			let backdrop = screen.getByRole('dialog', { hidden: true })
			await userEvent.click(backdrop)
			rerender(<DialogBase isModalOpen={true} closeOnOutsideClick={false} onClose={handleOnClose} />)
			backdrop = screen.getByRole('dialog', { hidden: true })
			await userEvent.click(backdrop)
			expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('open')
		})

		it('Closes when `escape` key clicked', async () => {
			render(<DialogBase isModalOpen />)
			await userEvent.keyboard('{Escape}')
			expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open')
		})

		it('Shows a single modal open at a time for multiple dialogs', async () => {
			render(<DialogBase data-testid="d1" isModalOpen singleVisible />)
			const { unmount } = render(<DialogBase data-testid="d2" isModalOpen singleVisible />)
			await waitFor(() => expect(screen.getByTestId('d1')).toHaveAttribute('open'))
			await waitFor(() => expect(screen.getByTestId('d1')).not.toBeVisible())
			await waitFor(() => expect(screen.getByTestId('d2')).toHaveAttribute('open'))
			await waitFor(() => expect(screen.getByTestId('d2')).toBeVisible())

			// Close the second dialog
			unmount()

			await waitFor(() => expect(screen.getByTestId('d1')).toBeVisible())
		})
	})
})
