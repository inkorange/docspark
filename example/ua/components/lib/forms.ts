/**
 * @param  {string} str
 * Sanitized a string to replace iOS 'smart' characters with ones that downstream systems can handle
 * also removes emojis
 */
export function sanitizeString(str: string) {
	return (
		str
			.replace(/[\u2014]/g, '--') // emdash
			.replace(/[\u2022]/g, '*') // bullet
			.replace(/^\s+/g, '') // space characters at the beginning
			.replace(/[\u2018\u2019]/g, "'") // smart single quotes
			.replace(/[\u201C\u201D]/g, '"') // smart double quotes
			.replace(/…/g, '.') // smart ellipsis converted to a single dot (retain string value length)
			// StackOverflow source of regex to remove emojis https://stackoverflow.com/a/41543705
			// further refined with a regex for Unicode property escapes: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Unicode_character_class_escape

			// whitelisted characters (+,=)
			.replace(/[^\p{L}\p{N}\p{P}\p{Z}+^$\n]/gu, '')
	)
}
