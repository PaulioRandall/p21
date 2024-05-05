const newJsLine = (prefix = 'p23') => {
	return RegExp(
		`^[^S\\\r\\\n]*//${prefix}((?:.[$a-zA-Z_][$a-zA-Z_0-9]*)+):(.*)$`,
		'igm'
	)
}

const newJsBlock = (prefix = 'p23') => {
	return RegExp(
		`^[^S\\\r\\\n]*\\\/\\\*${prefix}((?:.[$a-zA-Z_][$a-zA-Z_0-9]*)+):(.*?)\\\*\\\/`,
		'igms'
	)
}

const newHtml = (prefix = 'p23') => {
	return RegExp(
		`^[^S\\\r\\\n]*<!--${prefix}((?:.[$a-zA-Z_][$a-zA-Z_0-9]*)+):(.*?)-->`,
		'igms'
	)
}

export default {
	newJsLine,
	newJsBlock,
	newHtml,
}
