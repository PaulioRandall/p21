const newJsLine = (prefix = 'p23') => {
	// TODO: Lookahead to see if "\\\n[^S\\\r\\\n]*//" on the next line
	// TODO: if so the next line forms part of the comment.
	//
	// TODO: But the '[^S]*//' at the start will be replaced with '\n'
	//
	// TODO: Might need to add the s flag.
	return RegExp(
		`^[^\\\S\\\r\\\n]*\\\/\\\/${prefix}((?:.[$a-zA-Z_][$a-zA-Z_0-9]*)+):([^\\\n]*(?:\\\n[^\\\S\\\r\\\n]*\\\/\\\/(?!${prefix})[^\\\n]*)*)`,
		'igms'
	)
}

const newJsBlock = (prefix = 'p23') => {
	return RegExp(
		`^[^\S\\\r\\\n]*\\\/\\\*${prefix}((?:.[$a-zA-Z_][$a-zA-Z_0-9]*)+):(.*?)\\\*\\\/`,
		'igms'
	)
}

const newHtml = (prefix = 'p23') => {
	return RegExp(
		`^[^\S\\\r\\\n]*<!--${prefix}((?:.[$a-zA-Z_][$a-zA-Z_0-9]*)+):(.*?)-->`,
		'igms'
	)
}

export default {
	newJsLine,
	newJsBlock,
	newHtml,
}
