export default (s) => {
	if (s.startsWith('<!--')) {
		return parseHtmlBlockValue(s)
	} else if (s.startsWith('/*')) {
		return parseJsBlockValue(s)
	} else if (s.startsWith('//')) {
		return parseJsLineValue(s)
	}

	throw new Error(`[P23:parseNode] Enable to identify node type for:\n${s}`)
}

const parseHtmlBlockValue = (s) => {
	// <!--p23.name: value -->
	s = removePrefix(s)
	s = removeSuffix(s, '-->')
	return s
}

const parseJsBlockValue = (s) => {
	/*p23.name: value */
	s = removePrefix(s)
	s = removeSuffix(s, '*/')
	return s
}

const parseJsLineValue = (s) => {
	//p23.name: value

	//p23.name: zero
	// one

	//p23.name:
	// one
	//
	// three

	s = removePrefix(s)
	return removeCommentPrefixFromLines(s)
}

const removeCommentPrefixFromLines = (s) => {
	const lines = s.split('\n')

	for (let i = 0; i < lines.length; i++) {
		const linePrefix = lines[i].match(/^\s*\/\//)
		if (linePrefix) {
			lines[i] = lines[i].slice(linePrefix[0].length)
		}
	}

	return lines.join('\n')
}

const removePrefix = (s) => {
	const from = s.indexOf(':') + 1
	return s.slice(from)
}

const removeSuffix = (s, suffix) => {
	const to = s.length - suffix.length
	return s.slice(0, to)
}
