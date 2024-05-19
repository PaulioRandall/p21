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
		console.error(`[P23] Unable to parse with glob '${glob}'`)
		console.error(e)
		return null
	}
}

const parseOptions = (options) => {
	return {
		prefix: 'p23',
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
	//p23.name: Abc
	//p23.group.name: Abc
	const jsLineRegexp = regexp.newJsLine(options.prefix)
	const jsLineNodes = extractNodesWithRegexp(data, jsLineRegexp)
	tidyJsLineNodes(jsLineNodes)

	/*p23.name: Abc*/
	/*p23.group.name:
		Abc
		Xyz
	*/
	const jsBlockRegexp = regexp.newJsBlock(options.prefix)
	const jsBlockNodes = extractNodesWithRegexp(data, jsBlockRegexp)

	const jsNodes = mergeNodes(jsLineNodes, jsBlockNodes)

	//<!--p23.name: Abc-->
	//<!--p23.group.name: Abc-->
	//<!--p23.group.name:
	//  Abc
	//	Xyz
	//-->
	const htmlRegexp = regexp.newHtml(options.prefix)
	const htmlNodes = extractNodesWithRegexp(data, htmlRegexp)

	return mergeNodes(jsNodes, htmlNodes)
}

const extractNodesWithRegexp = (data, regexp) => {
	const nodes = {}
	let next = null

	while ((next = regexp.exec(data)) !== null) {
		insertNodeInto(
			nodes, //
			parseNodeNames(next[1]),
			next[2]
		)
	}

	return nodes
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
	const lastIdx = nodeNames.length - 1

	for (let i = 0; i < nodeNames.length; i++) {
		const name = nodeNames[i]

		if (i === lastIdx) {
			nodes[name] = value
			return
		}

		if (!nodes[name]) {
			nodes[name] = {}
		}

		nodes = nodes[name]
	}
}
