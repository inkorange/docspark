import { forwardRef, useEffect, useRef } from 'react'
import { exposeRefTo } from './index'
import { render } from '@testing-library/react'

/*
 * WARNING: This is NOT a conventional way to write tests for React components OR React utility functions.
 * This unorthodox approach to testing is only being done here due to the unique requirements of `exposeRefTo`.
 */
describe('Expose Ref To (React Ref Composer)', () => {
	it('Exposes the reference pointing to an underyling `HTMLElement` to ALL valid React Refs', () => {
		/* -------------------- Test Functionality _within_ the Component -------------------- */
		const Dialog = forwardRef<HTMLDialogElement, React.ComponentPropsWithoutRef<'dialog'>>(function Dialog(_, ref) {
			const localRef = useRef({} as HTMLDialogElement)
			const localCallbackRef: (reactRef: HTMLDialogElement | null) => void = jest.fn()

			useEffect(() => {
				expect(localRef.current).toBeInstanceOf(HTMLDialogElement)
				expect(localCallbackRef).toHaveBeenCalledWith(expect.any(HTMLDialogElement))
			})

			// eslint-disable-next-line react/forbid-elements
			return <dialog ref={exposeRefTo(localRef, localCallbackRef, ref)} />
		})

		/* -------------------- Test Functionality of _Consumer_ Components -------------------- */
		function DialogCaller() {
			const callerRef = useRef({} as HTMLDialogElement)
			const callerCallbackRef: (reactRef: HTMLDialogElement | null) => void = jest.fn()

			useEffect(() => {
				expect(callerRef.current).toBeInstanceOf(HTMLDialogElement)
				expect(callerCallbackRef).toHaveBeenCalledWith(expect.any(HTMLDialogElement))
			})

			return (
				<>
					{/* No `ref` forwarded at all */}
					<Dialog />

					{/* `useRef` object forwarded to component */}
					<Dialog ref={callerRef} />

					{/* `ref` callback forwarded to component */}
					<Dialog ref={callerCallbackRef} />
				</>
			)
		}

		// Verify that nothing should break for forwarded `ref`s, even when no `ref` is forwarded at all
		expect(() => render(<DialogCaller />)).not.toThrow()
	})
})

/*
 * Note: This section is ONLY for TypeScript type enforcement/validation. The early return statement is to prevent
 * these type-only tests from inaccurately contributing to test coverage.
 *
 * The point of these type-only tests is to safeguard the `exposeRefTo` utility from _dangerous_ refactors
 * that disable proper TypeScript enforcement. For example, the `exposeRefTo` utility should never allow
 * contradictory references (e.g., `HTMLInputElement` and `HTMLDialogElement`) to be simultaneously
 * supplied as arguments because this would result in JS runtime errors. The test below enforces this.
 * (The TS compiler will throw an error if this constraint is ever loosened, thanks to `@ts-expect-error`.)
 */
;(function runTypeOnlyTests() {
	return undefined

	/* eslint-disable no-unreachable */
	/* eslint-disable react-hooks/rules-of-hooks */
	const dialogRef = useRef({} as HTMLDialogElement)
	const callbackInputRef: (reactRef: HTMLInputElement | null) => void = () => undefined

	// @ts-expect-error -- Clashing `HTMLElement` references should not be allowed by the utility function
	exposeRefTo(dialogRef, callbackInputRef)
	/* eslint-enable no-unreachable */
	/* eslint-enable react-hooks/rules-of-hooks */
})()
