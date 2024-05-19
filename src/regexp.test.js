import regexp from './regexp.js'

describe('regexp.js', () => {
	describe('newJsLine', () => {
		test('Non-nested node', () => {
			const act = regexp.newJsLine().exec('//p23.name:value')
			const exp = expect.arrayContaining(['//p23.name:value'])
			expect(act).toEqual(exp)
		})

		test('Multiple single line comments in series', () => {
			const input = [
				'//p23.description:',
				'  // Abc',
				'  // 123',
				'  //',
				'  // Xyz',
			].join('\n')

			const act = regexp.newJsLine().exec(input)
			const exp = expect.arrayContaining([input])
			expect(act).toEqual(exp)
		})

		test('Custom prefix', () => {
			const input = '//my_custom_prefix.name:value'
			const act = regexp.newJsLine('my_custom_prefix.').exec(input)
			const exp = expect.arrayContaining([input])
			expect(act).toEqual(exp)
		})

		test('Nested node', () => {
			const input = '//p23.group.name:value'
			const act = regexp.newJsLine().exec(input)
			const exp = expect.arrayContaining([input])
			expect(act).toEqual(exp)
		})

		test('Messed up but valid node names', () => {
			const input = '//p23.$$$12313___.__dsfjk12$$6389__$$:value'
			const act = regexp.newJsLine().exec(input)
			const exp = expect.arrayContaining([input])
			expect(act).toEqual(exp)
		})

		test('Empty value still returns entry', () => {
			const input = '//p23.name:'
			const act = regexp.newJsLine().exec(input)
			const exp = expect.arrayContaining([input])
			expect(act).toEqual(exp)
		})

		test('Fails if number first in node name', () => {
			const act = regexp.newJsLine().exec('//p23.1name:value')
			expect(act).toEqual(null)
		})

		test('Fails if missing node name', () => {
			const act = regexp.newJsLine().exec('//p23:value')
			expect(act).toEqual(null)
		})

		test('Fails if missing node name (version two)', () => {
			const act = regexp.newJsLine().exec('//p23.:value')
			expect(act).toEqual(null)
		})

		test('Fails if missing colon', () => {
			const act = regexp.newJsLine().exec('//p23.name')
			expect(act).toEqual(null)
		})
	})

	const multiLineInput = `p23.name:\n\tvalue\n\tAbc\n\tXyz\n\t`

	describe('newJsBlock', () => {
		test('Single line block', () => {
			const input = '/*p23.name:value*/'
			const act = regexp.newJsBlock().exec(input)
			const exp = expect.arrayContaining([input])
			expect(act).toEqual(exp)
		})

		test('Multi line block', () => {
			const act = regexp.newJsBlock().exec(`/*${multiLineInput}*/`)
			const exp = expect.arrayContaining([`/*${multiLineInput}*/`])
			expect(act).toEqual(exp)
		})
	})

	describe('newHtml', () => {
		test('Single line block', () => {
			const input = '<!--p23.name:value-->'
			const act = regexp.newHtml().exec(input)
			const exp = expect.arrayContaining([input])
			expect(act).toEqual(exp)
		})

		test('Multi line block', () => {
			const act = regexp.newHtml().exec(`<!--${multiLineInput}-->`)
			const exp = expect.arrayContaining([`<!--${multiLineInput}-->`])
			expect(act).toEqual(exp)
		})
	})
})
