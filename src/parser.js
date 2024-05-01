import fs from 'fs'
import path from 'path'
import { globSync } from 'glob'

const defaultGlobOptions = {
	nodir: true,
}

export const newJavaScriptNodeRegexp = (prefix = 'p23') => {
	return RegExp(
		`^[^S\r\n]*//${prefix}((?:.[$a-zA-Z_][$a-zA-Z_0-9]*)+):(.*)$`,
		'igm'
	)
}

export const newHtmlNodeRegexp = (prefix = 'p23') => {
	return RegExp(
		`^[^S\r\n]*<!--${prefix}((?:.[$a-zA-Z_][$a-zA-Z_0-9]*)+):(.*?)-->`,
		'igms'
	)
}

export const parse = (glob = '**/*.svelte', options = {}) => {
	try {
		options = parseOptions(options)
		return parseTree(glob, options)
	} catch (e) {
		console.error(`[P23] Unable to parse with glob '${glob}'`)
		console.error(e)
		return null
	}
}

const parseOptions = (options) => {
	return {
		prefix: 'p23',
		globOptions: defaultGlobOptions,
		...options,
	}
}

const parseTree = (glob, options) => {
	return listFiles(glob, options) //
		.map(fileInfo)
		.map((f) => appendFileNodes(f, options))
}

const listFiles = (glob, options) => {
	return globSync(glob, options.globOptions).sort()
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
	// Examples:
	//p23.name: Abc
	//p23.group.name: Abc
	const jsRegexp = newJavaScriptNodeRegexp(options.prefix)
	const jsNodes = extractNodesWithRegexp(data, jsRegexp)

	// Examples:
	//<!--p23.name: Abc-->
	//<!--p23.group.name: Abc-->
	//<!--p23.group.name:
	//  Abc
	//-->
	const htmlRegexp = newHtmlNodeRegexp(options.prefix)
	const htmlNodes = extractNodesWithRegexp(data, htmlRegexp)

	return joinNodeTrees(jsNodes, htmlNodes)
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

const joinNodeTrees = (a, b) => {
	if (typeof a !== 'object') {
		return structuredClone(b)
	}

	const nodes = structuredClone(a)

	for (const name in b) {
		if (typeof b[name] === 'object') {
			nodes[name] = joinNodeTrees(nodes[name], b[name])
		} else {
			nodes[name] = b[name]
		}
	}

	return nodes
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
