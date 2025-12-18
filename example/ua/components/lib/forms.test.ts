import { sanitizeString } from './forms'

describe('forms.ts', () => {
	describe('sanitizeString', () => {
		it('returns the appropriate sanitized string', () => {
			expect(sanitizeString('John Doe was here')).toEqual('John Doe was here') // as is
			expect(sanitizeString('(631) 666 - 7777)')).toEqual('(631) 666 - 7777)') // as is
			expect(sanitizeString('jêai mangé')).toEqual('jêai mangé') // as is
			expect(sanitizeString('â ê î ô û Д д')).toEqual('â ê î ô û Д д') // as is
			expect(sanitizeString('河湖流沖滑')).toEqual('河湖流沖滑') // as is
			expect(sanitizeString('[[[@#$%^&*()]]]!!!]]]')).toEqual('[[[@#$%^&*()]]]!!!]]]') // as is

			// character replacements
			expect(sanitizeString('j’ai mangé')).toEqual("j'ai mangé")
			expect(sanitizeString('“…”')).toEqual('"."')
			expect(sanitizeString('“""\'""”’’')).toEqual('"""\'"""\'\'')
			expect(sanitizeString('<div>This HTML</div>')).toEqual('divThis HTML/div')

			// emojis
			expect(sanitizeString('🤩🤩🤩🤩🥵🥵🥵')).toEqual('')
			expect(sanitizeString('️️️‍️️🪝🪝🪝🪝🪝🪝🪝🪝')).toEqual('')

			// complex
			expect(sanitizeString('️️️‍️️Testî ô û Д🪝🪝🤩’🪝🪝流沖滑')).toEqual("Testî ô û Д'流沖滑")

			// special symbols like +
			expect(sanitizeString('️️️‍️️=🪝🪝++🪝🪝🪝')).toEqual('++')
			expect(sanitizeString('️️️‍️️Test+=🍅')).toEqual('Test+')
		})
	})
})
