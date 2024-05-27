import fs from 'fs'
import path from 'path'
import { globSync } from 'glob'
import regexp from './regexp.js'

const defaultGlobOptions = {
	nodir: true,
}

export default (options = {}) => {
	try {
		options = parseOptions(options)
		return parseTree(options)
	} catch (e) {
		console.error(`[P23] Unable to parse with glob '${options.glob}'`)
		console.error(e)
		return null
	}
}

const parseOptions = (options) => {
	return {
		prefix: 'p23.',
		glob: '**/*.svelte',
		globOptions: defaultGlobOptions,
		...options,
	}
}

const parseTree = (options) => {
	return listFiles(options) //
		.map(fileInfo)
		.map((f) => appendFileNodes(f, options))
}

const listFiles = (options) => {
	return globSync(options.glob, options.globOptions).sort()
}

const fileInfo = (filePath) => {
	return {
		name: path.basename(filePath),
		relPath: filePath,
		absPath: path.resolve(filePath),
	}
}

const appendFileNodes = (f, options) => {
	const data = readWholeFile(f.absPath)
	f.nodes = extractNodes(data, options)
	return f
}

const readWholeFile = (absPath) => {
	return fs.readFileSync(absPath, { encoding: 'utf-8' })
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

const tidyJsLineNodes = (nodes) => {
	for (const k in nodes) {
		const v = nodes[k]

		if (isObject(v)) {
			tidyJsLineNodes(v)
		} else {
			nodes[k] = v.replace(/^[^\S\r\n]*\/\//gm, '')
		}
	}
}

const mergeNodes = (dst, src) => {
	for (const k in src) {
		if (isObject(dst[k]) && isObject(src[k])) {
			mergeNodes(dst[k], src[k])
		} else {
			dst[k] = src[k]
		}
	}

	return dst
}

const isObject = (v) => {
	return !!v && typeof v === 'object' && !Array.isArray(v)
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
