const newJsLine = (prefix = 'p23') => {
	return RegExp(
		String.raw`\/\/${prefix}((?:\.[$a-zA-Z_][$a-zA-Z_0-9]*)+):[^\n]*(?:\n[^\S\r\n]*\/\/(?!${prefix})[^\n]*)*`,
		'igms'
	)
}

const newJsBlock = (prefix = 'p23') => {
	return RegExp(
		String.raw`\/\*${prefix}((?:\.[$a-zA-Z_][$a-zA-Z_0-9]*)+):.*?\*\/`,
		'igms'
	)
}

const newHtml = (prefix = 'p23') => {
	return RegExp(
		String.raw`<!--${prefix}((?:\.[$a-zA-Z_][$a-zA-Z_0-9]*)+):.*?-->`,
		'igms'
	)
}

export default {
	newJsLine,
	newJsBlock,
	newHtml,
}
