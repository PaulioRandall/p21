import fs from 'fs'

export default (files) => {
	return files.map((f) => {
		f.content = fs.readFileSync(f.absPath, { encoding: 'utf-8' })
		return f
	})
}
