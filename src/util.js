export const parseNodeValue = (s) => {
	if (s.startsWith('<!--')) {
		return parseHtmlBlockValue(s)
	} else if (s.startsWith('/*')) {
		// TODO
	} else if (s.startsWith('//')) {
		// TODO
	}

	throw new Error(`[P23:parseNode] Enable to identify node type:\n${s}`)
}

export const parseHtmlBlockValue = (s) => {
	// <!--p23.name: value -->
	return delimitBlock(s, '-->')
}

export const parseJsBlockValue = (s) => {}

export const parseJsLineValue = (s) => {}

const delimitBlock = (s, suffix) => {
	const from = s.indexOf(':') + 1
	const to = s.length - suffix.length
	return s.slice(from, to).trim()
}

export default {
	parseNodeValue,
	parseHtmlBlockValue,
	parseJsBlockValue,
	parseJsLineValue,
}
