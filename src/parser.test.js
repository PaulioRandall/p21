import upath from 'upath'
import { parse, newNodeRegExp } from './parser.js'

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

const parseToUnix = (f) => {
	return parse(f).map((m) => {
		m.relPath = upath.toUnix(m.relPath)
		m.absPath = upath.toUnix(m.absPath)
		return m
	})
}

describe('p23', () => {
	describe('newNodeRegExp', () => {
		test('Non-nested node', () => {
			const act = newNodeRegExp().exec('//p23.name:value')
			const exp = expect.arrayContaining(['//p23.name:value', '.name', 'value'])
			expect(act).toEqual(exp)
		})

		test('Custom prefix', () => {
			const act = newNodeRegExp('my_custom_prefix').exec(
				'//my_custom_prefix.name:value'
			)
			const exp = expect.arrayContaining([
				'//my_custom_prefix.name:value',
				'.name',
				'value',
			])
			expect(act).toEqual(exp)
		})

		test('Nested node', () => {
			const act = newNodeRegExp().exec('//p23.group.name:value')
			const exp = expect.arrayContaining([
				'//p23.group.name:value',
				'.group.name',
				'value',
			])
			expect(act).toEqual(exp)
		})

		test('Messed up but valid node names', () => {
			const act = newNodeRegExp().exec(
				'//p23.$$$12313___.__dsfjk12$$6389__$$:value'
			)
			const exp = expect.arrayContaining([
				'//p23.$$$12313___.__dsfjk12$$6389__$$:value',
				'.$$$12313___.__dsfjk12$$6389__$$',
				'value',
			])
			expect(act).toEqual(exp)
		})

		test('Empty value still returns entry', () => {
			const act = newNodeRegExp().exec('//p23.name:')
			const exp = expect.arrayContaining(['//p23.name:', '.name', ''])
			expect(act).toEqual(exp)
		})

		test('Fails if number first in node name', () => {
			const act = newNodeRegExp().exec('//p23.1name:value')
			expect(act).toEqual(null)
		})

		test('Fails if missing node name', () => {
			const act = newNodeRegExp().exec('//p23:value')
			expect(act).toEqual(null)
		})

		test('Fails if missing node name (version two)', () => {
			const act = newNodeRegExp().exec('//p23.:value')
			expect(act).toEqual(null)
		})

		test('Fails if missing colon', () => {
			const act = newNodeRegExp().exec('//p23.name')
			expect(act).toEqual(null)
		})
	})

	describe('parse', () => {
		test('Parses non-nested single line node', () => {
			const file = createSvelteFilePath('LineDoc_NonNested')
			const metadata = parse(file)

			expect(metadata).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						artist: 'Rhapsody of Fire',
					},
				},
			])
		})

		test('Parses non-nested single line node (lowercase p23)', () => {
			const file = createSvelteFilePath('LineDoc_NonNested_Lowercase')
			const metadata = parse(file)

			expect(metadata).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						artist: 'Rhapsody of Fire',
					},
				},
			])
		})

		test('Parses multiple non-nested single line nodes', () => {
			const file = createSvelteFilePath('LineDoc_NonNested_Multiple')
			const metadata = parse(file)

			expect(metadata).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						artist: 'Rhapsody of Fire',
						album: 'From Chaos to Eternity',
						release_date: '2011-06-17',
					},
				},
			])
		})

		test('Parses nested single line node', () => {
			const file = createSvelteFilePath('LineDoc_Nested')
			const metadata = parse(file)

			expect(metadata).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						bands: {
							artist: 'Rhapsody of Fire',
						},
					},
				},
			])
		})

		test('Parses nested single line node 2', () => {
			const file = createSvelteFilePath('LineDoc_Nested_2')
			const metadata = parse(file)

			expect(metadata).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						music: {
							bands: {
								artist: 'Rhapsody of Fire',
							},
						},
					},
				},
			])
		})

		test('Parses comprehensive set of nested and non-nested nodes', () => {
			const file = createSvelteFilePath('LineDoc_Complex')
			const metadata = parse(file)

			expect(metadata).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						type: 'Music',
						music: {
							type: 'Band',
							band: {
								name: 'Rhapsody of Fire',
								genre: 'Symphonic Power Metal',
								albums: '["Rhapsody of Fire","Triumph or Agony"]',
							},
						},
					},
				},
			])
		})

		test('Parses directory', () => {
			const dir = upath.join(`${testdataDir}/dir`)
			const metadata = parse(dir + '/**/*.svelte')

			expect(metadata).toEqual([
				{
					name: 'BandOne.svelte',
					relPath: upath.join(`${testdataDir}/dir/BandOne.svelte`),
					absPath: upath.resolve(`${testdataDir}/dir/BandOne.svelte`),
					nodes: {
						artist: 'Rhapsody of Fire',
					},
				},
				{
					name: 'BandTwo.svelte',
					relPath: upath.join(`${testdataDir}/dir/BandTwo.svelte`),
					absPath: upath.resolve(`${testdataDir}/dir/BandTwo.svelte`),
					nodes: {
						artist: 'Children of Bodom',
					},
				},
			])
		})

		test('Parses with option', () => {
			const file = createSvelteFilePath('LineDoc_Option_Prefix')
			const metadata = parse(file, {
				prefix: 'my_custom_prefix',
			})

			expect(metadata).toEqual([
				{
					...generateFileFields(file),
					nodes: {
						artist: 'Rhapsody of Fire',
					},
				},
			])
		})
	})
})
