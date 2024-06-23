export default (files) => {
	return files.map((f) => {
		cleanNodeTree(f.nodes)
		return f
	})
}

const cleanNodeTree = (tree) => {
	for (const name in tree) {
		const v = tree[name]

		if (isObject(v)) {
			cleanNodeTree(v)
			continue
		}

		for (let i = 0; i < v.length; i++) {
			v[i] = cleanNodeValue(v[i])
		}
	}
}

const isObject = (v) => {
	return !!v && typeof v === 'object' && !Array.isArray(v)
}

export const cleanNodeValue = (s) => {
	if (s.trim().startsWith('<!--')) {
		return cleanHtmlBlockValue(s)
	} else if (s.trim().startsWith('/*')) {
		return cleanJsBlockValue(s)
	} else if (s.trim().startsWith('//')) {
		return cleanJsLineValue(s)
	}

	throw new Error(`[P23] Unable to identify node type for:\n${s}`)
}

const cleanJsLineValue = (s) => {
	//p23.name value

	//p23.name zero
	// one

	//p23.name
	// one
	//
	// three

	const indent = parseIndent(s)
	s = s.slice(indent.length)

	s = removePrefix(s)
	return removeCommentPrefixFromLines(s)
}

const removeCommentPrefixFromLines = (s) => {
	const lines = s.split('\n')

	for (let i = 1; i < lines.length; i++) {
		// Remove the indent and comment delimter.
		const linePrefix = lines[i].match(/^\s*\/\//)
		if (linePrefix) {
			lines[i] = lines[i].slice(linePrefix[0].length)
		}

		// Remove the leading space if there is one, and only one, leading space.
		if (/^ [^ ]/.test(lines[i])) {
			lines[i] = lines[i].slice(1)
		}
	}

	return lines.join('\n')
}

const cleanJsBlockValue = (s) => {
	/*p23.name value */

	const indent = parseIndent(s)
	s = s.slice(indent.length)

	s = removePrefix(s)
	s = removeSuffix(s, '*/')

	/* Sometimes
	like this
	 and sometimes like this
	 * and sometimes like this
	*/
	s = removeJsBlockLineIndents(s, indent)
	return s
}

const cleanHtmlBlockValue = (s) => {
	// <!--p23.name value -->

	const indent = parseIndent(s)
	s = s.slice(indent.length)

	s = removePrefix(s)
	s = removeSuffix(s, '-->')

	/*
	<!-- Sometimes
	like this
	 and sometimes like this
	 * and sometimes like this
	-->
	*/
	s = removeHtmlBlockLineIndents(s, indent)
	return s
}

const parseIndent = (s) => {
	return s.match(/^\s*/)[0]
}

const removePrefix = (s) => {
	const from = s.search(/\s/) || 0
	return s.slice(from)
}

const removeSuffix = (s, suffix) => {
	const to = s.length - suffix.length
	return s.slice(0, to)
}

const removeJsBlockLineIndents = (s, indent) => {
	const lines = s.split('\n')

	for (let i = 1; i < lines.length; i++) {
		if (lines[i].startsWith(indent)) {
			lines[i] = lines[i].slice(indent.length)
		}

		if (/^ \* /.test(lines[i])) {
			lines[i] = lines[i].slice(3)
		} else if (/^\t/.test(lines[i])) {
			lines[i] = lines[i].slice(1)
		} else if (/^  /.test(lines[i])) {
			lines[i] = lines[i].slice(2)
		}
	}

	return lines.join('\n')
}

const removeHtmlBlockLineIndents = (s, indent) => {
	const lines = s.split('\n')

	for (let i = 1; i < lines.length; i++) {
		if (lines[i].startsWith(indent)) {
			lines[i] = lines[i].slice(indent.length)
		}

		if (/^ /.test(lines[i])) {
			lines[i] = lines[i].slice(1)
		}
	}

	return lines.join('\n')
}
