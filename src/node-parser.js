import regexp from './regexp.js'

const defaultGlobOptions = {
	nodir: true,
}

export default (files, options = {}) => {
	options = parseOptions(options)
	return files.map((f) => {
		f.nodes = extractNodes(f.content, options)
		return f
	})
}

const parseOptions = (options) => {
	return {
		prefix: 'p23.',
		...options,
	}
}

const extractNodes = (data, options) => {
	const nodes = {}

	//p23.name: Abc
	//p23.group.name: Abc
	const jsLineRegexp = regexp.newJsLine(options.prefix)
	extractNodesWithRegexp(nodes, data, jsLineRegexp)

	/*p23.name: Abc*/
	/*p23.group.name:
		Abc
		Xyz
	*/
	const jsBlockRegexp = regexp.newJsBlock(options.prefix)
	extractNodesWithRegexp(nodes, data, jsBlockRegexp)

	//<!--p23.name: Abc-->
	//<!--p23.group.name: Abc-->
	//<!--p23.group.name:
	//  Abc
	//	Xyz
	//-->
	const htmlRegexp = regexp.newHtml(options.prefix)
	extractNodesWithRegexp(nodes, data, htmlRegexp)

	return nodes
}

const extractNodesWithRegexp = (nodes, data, regexp) => {
	let next = null

	while ((next = regexp.exec(data)) !== null) {
		insertNodeInto(
			nodes, //
			parseNodeNames(next[1]),
			next[0]
		)
	}
}

const parseNodeNames = (nodeNames) => {
	return nodeNames.split('.').filter((s) => !!s)
}

const insertNodeInto = (nodes, nodeNames, value) => {
	const parent = createParentNodes(nodes, nodeNames.slice(0, -1))
	const last = nodeNames[nodeNames.length - 1]

	if (!Array.isArray(parent[last])) {
		parent[last] = []
	}

	parent[last].push(value)
}

const createParentNodes = (nodes, parents) => {
	let n = nodes

	for (const name of parents) {
		if (!n[name]) {
			n[name] = {}
		}

		n = n[name]
	}

	return n
}
