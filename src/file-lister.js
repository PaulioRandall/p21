import path from 'path'
import { globSync } from 'glob'

const defaultGlobOptions = {
	nodir: true,
}

export default (options = {}) => {
	options = parseOptions(options)
	return parseTree(options)
}

const parseOptions = (options) => {
	return {
		glob: '**/*.svelte',
		globOptions: defaultGlobOptions,
		...options,
	}
}

const parseTree = (options) => {
	return listFiles(options).map(fileInfo)
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
