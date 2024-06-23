const wsRule = String.raw`[^\S\n]*` // Except linefeeds
const pathSegmentRule = String.raw`[$@a-zA-Z_][$@a-zA-Z0-9_\-]`
const pathRule = String.raw`(${pathSegmentRule}*(?:\.${pathSegmentRule}*)*)`

const newJsLine = (prefix = 'p23.') => {
	prefix = String.raw`${prefix}`
	return RegExp(
		String.raw`^${wsRule}\/\/${prefix}${pathRule}\s[^\n]*(?:\n${wsRule}\/\/(?!${prefix})[^\n]*)*`,
		'igms'
	)
}

const newJsBlock = (prefix = 'p23.') => {
	prefix = String.raw`${prefix}`
	return RegExp(String.raw`^${wsRule}\/\*${prefix}${pathRule}\s.*?\*\/`, 'igms')
}

const newHtml = (prefix = 'p23.') => {
	prefix = String.raw`${prefix}`
	return RegExp(String.raw`^${wsRule}<!--${prefix}${pathRule}\s.*?-->`, 'igms')
}

export default {
	newJsLine,
	newJsBlock,
	newHtml,
}
