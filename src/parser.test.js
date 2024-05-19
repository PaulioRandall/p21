import upath from 'upath'
import parse from './parser.js'
const testdataDir = './src/testdata'

const createSvelteFilePath = (filename) => {
	return upath.join(`${testdataDir}/files/${filename}.svelte`)
}

const generateFileFields = (file) => {
	return {
		name: upath.basename(file),
		relPath: upath.join(file),
		absPath: upath.resolve(file),
	}
}

const parseToUnix = (file) => {
	return parse({ glob: file }).map((m) => {
		m.relPath = upath.toUnix(m.relPath)
		m.absPath = upath.toUnix(m.absPath)
		return m
	})
}

describe('parser.js', () => {
	describe('parse', () => {
		test('Parses no docs', () => {
			const file = createSvelteFilePath('NoDocs')
			const metadata = parse({ glob: file })

			expect(metadata).toEqual([
				{
					...generateFileFields(file),
					nodes: {},
				},
			])
		})

		test('Parses non-nested single line node', () => {
			const file = createSvelteFilePath('JsLine_NonNested')
			const metadata = parse({ glob: file })

			expect(metadata).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						artist: '//p23.artist: Rhapsody of Fire',
					},
				},
			])
		})

		test('Parses multiple lines in series that represent a single node', () => {
			const file = createSvelteFilePath('JsLine_MultiLine')
			const metadata = parse({ glob: file })

			expect(metadata).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						name: '//p23.name: Meh',
						description: `//p23.description: Abc
	// a
	// b
	//
	// y
	// z`,
					},
				},
			])
		})

		test('Parses multiple non-nested single line nodes', () => {
			const file = createSvelteFilePath('JsLine_NonNested_Multiple')
			const metadata = parse({ glob: file })

			expect(metadata).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						artist: '//p23.artist: Rhapsody of Fire',
						album: '//p23.album: From Chaos to Eternity',
						release_date: '//p23.release_date: 2011-06-17',
					},
				},
			])
		})

		test('Parses nested single line node', () => {
			const file = createSvelteFilePath('JsLine_Nested')
			const metadata = parse({ glob: file })

			expect(metadata).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						bands: {
							artist: '//p23.bands.artist: Rhapsody of Fire',
						},
					},
				},
			])
		})

		test('Parses nested single line node 2', () => {
			const file = createSvelteFilePath('JsLine_Nested_2')
			const metadata = parse({ glob: file })

			expect(metadata).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						music: {
							bands: {
								artist: '//p23.music.bands.artist: Rhapsody of Fire',
							},
						},
					},
				},
			])
		})

		test('Parses comprehensive set of nested and non-nested nodes', () => {
			const file = createSvelteFilePath('JsLine_Complex')
			const metadata = parse({ glob: file })

			expect(metadata).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						type: '//p23.type: Music',
						music: {
							type: '//p23.music.type: Band',
							band: {
								name: '//p23.music.band.name: Rhapsody of Fire',
								genre: '//p23.music.band.genre: Symphonic Power Metal',
								albums: `//p23.music.band.albums: [
	// "Rhapsody of Fire",
	// "Triumph or Agony",
	// ]`,
							},
						},
					},
				},
			])
		})

		test('Parses directory', () => {
			const dir = upath.join(`${testdataDir}/dir`)
			const metadata = parse({ glob: dir + '/**/*.svelte' })

			expect(metadata).toEqual([
				{
					name: 'BandOne.svelte',
					relPath: upath.join(`${testdataDir}/dir/BandOne.svelte`),
					absPath: upath.resolve(`${testdataDir}/dir/BandOne.svelte`),
					nodes: {
						artist: '//p23.artist: Rhapsody of Fire',
					},
				},
				{
					name: 'BandTwo.svelte',
					relPath: upath.join(`${testdataDir}/dir/BandTwo.svelte`),
					absPath: upath.resolve(`${testdataDir}/dir/BandTwo.svelte`),
					nodes: {
						artist: '//p23.artist: Children of Bodom',
					},
				},
			])
		})

		test('Parses with option', () => {
			const file = createSvelteFilePath('JsLine_Option_Prefix')
			const metadata = parse({
				glob: file,
				prefix: 'my_custom_prefix',
			})

			expect(metadata).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						artist: '//my_custom_prefix.artist: Rhapsody of Fire',
					},
				},
			])
		})

		test('Parses with HTML docs', () => {
			const file = createSvelteFilePath('htmlDocs')
			const metadata = parse({ glob: file })

			expect(metadata).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						type: '//p23.type: Music',
						music: {
							type: '//p23.music.type: Band',
							band: {
								name: '<!--p23.music.band.name: Rhapsody of Fire-->',
								genre: '<!--p23.music.band.genre: Symphonic Power Metal-->',
								albums: `<!--p23.music.band.albums:
	[
		"Rhapsody of Fire",
		"Triumph or Agony",
	]
-->`,
							},
						},
					},
				},
			])
		})

		test('Parses block comment on a single line', () => {
			const file = createSvelteFilePath('JsBlock_Line')
			const metadata = parse({ glob: file })

			expect(metadata).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						artist: '/*p23.artist: Rhapsody of Fire*/',
					},
				},
			])
		})

		test('Parses block comment on multiple lines', () => {
			const file = createSvelteFilePath('JsBlock_Lines')
			const metadata = parse({ glob: file })

			expect(metadata).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						artist: `/*p23.artist:
		Rhapsody of Fire
	*/`,
					},
				},
			])
		})
	})
})
