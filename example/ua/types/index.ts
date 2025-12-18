import React from 'react'
/** Used to handle css size properties */
export type Unit = '%' | 'px' | 'em' | 'vh' | 'vw'

/** Used to indicate the various "loading states" of an asynchronous flow */
export type AsyncStatus = 'idle' | 'pending' | 'resolved' | 'rejected'

/** Utility to cherry-pick properties as optional */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

/** Makes the specified optional properties of `T` required */
export type RequireKeys<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K> extends infer O
	? { [P in keyof O]: O[P] }
	: never

/** Makes the properties of `T` nullable or undefined. Opposes the generic NonNullable type */
export type Nullable<T> = { [K in keyof T]: T[K] | null | undefined }

type AnyElementProps<E extends React.ElementType = React.ElementType> = Omit<React.ComponentPropsWithRef<E>, 'as'> & {
	as?: E
}

/** Combines the props `P` of a given component with the props of the provided element `E` (e.g., `"div"`) */
export type PolymorphicComponentProps<E extends React.ElementType, P> = P & AnyElementProps<E>

declare global {
	namespace jest {
		interface Matchers<R> {
			fail(msg: string): R
		}
	}
}
