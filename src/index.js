import listFiles from './file-lister.js'
import loadContent from './content-loader.js'
import parseNodes from './node-parser.js'

export { default as cleanNodes } from './node-cleaner.js'

export default (options = {}) => {
	const files = listFiles(options)
	const filesWithContent = loadContent(files)
	return parseNodes(filesWithContent, options)
}
