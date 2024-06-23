import upath from 'upath'
import list from './file-lister.js'

describe('file-lister.js', () => {
	test('Component.svelte', () => {
		const src = `src/testdata/Component.svelte`
		const file = upath.join(src)
		const info = list({ glob: file })

		expect(info?.length).toEqual(1)

		const exp = {
			name: 'Component.svelte',
			relPath: upath.toUnix(src),
			absPath: upath.toUnix(upath.resolve(src)),
		}

		expect(info[0]).toEqual(exp)
	})
})
