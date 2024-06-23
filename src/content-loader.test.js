import path from 'path'
import load from './content-loader.js'

describe('content-loader.js', () => {
	test('Component.svelte', () => {
		const src = `src/testdata/Component.svelte`
		const given = [
			{
				name: 'Component.svelte',
				relPath: src,
				absPath: path.resolve(src),
			},
		]

		const act = load(given)

		const exp = [
			{
				name: 'Component.svelte',
				relPath: src,
				absPath: path.resolve(src),
				content: `<script>
	//p23.type Music

	/*p23.artist
		Rhapsody of Fire
	*/
</script>

<!--p23.genre Symphonic Power Metal-->
`,
			},
		]

		expect(act).toEqual(exp)
	})
})
