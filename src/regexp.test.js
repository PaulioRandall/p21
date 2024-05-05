import regexp from './regexp.js'

describe('regexp.js', () => {
	describe('newJsLine', () => {
		test('Non-nested node', () => {
			const act = regexp.newJsLine().exec('//p23.name:value')
			const exp = expect.arrayContaining(['//p23.name:value', '.name', 'value'])
			expect(act).toEqual(exp)
		})

		test('Custom prefix', () => {
			const act = regexp
				.newJsLine('my_custom_prefix')
				.exec('//my_custom_prefix.name:value')
			const exp = expect.arrayContaining([
				'//my_custom_prefix.name:value',
				'.name',
				'value',
			])
			expect(act).toEqual(exp)
		})

		test('Nested node', () => {
			const act = regexp.newJsLine().exec('//p23.group.name:value')
			const exp = expect.arrayContaining([
				'//p23.group.name:value',
				'.group.name',
				'value',
			])
			expect(act).toEqual(exp)
		})

		test('Messed up but valid node names', () => {
			const act = regexp
				.newJsLine()
				.exec('//p23.$$$12313___.__dsfjk12$$6389__$$:value')
			const exp = expect.arrayContaining([
				'//p23.$$$12313___.__dsfjk12$$6389__$$:value',
				'.$$$12313___.__dsfjk12$$6389__$$',
				'value',
			])
			expect(act).toEqual(exp)
		})

		test('Empty value still returns entry', () => {
			const act = regexp.newJsLine().exec('//p23.name:')
			const exp = expect.arrayContaining(['//p23.name:', '.name', ''])
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

	describe('newHtml', () => {
		test('Non-nested node', () => {
			const act = regexp.newHtml().exec('<!--p23.name:value-->')
			const exp = expect.arrayContaining([
				'<!--p23.name:value-->',
				'.name',
				'value',
			])
			expect(act).toEqual(exp)
		})

		test('Custom prefix', () => {
			const act = regexp
				.newHtml('my_custom_prefix')
				.exec('<!--my_custom_prefix.name:value-->')
			const exp = expect.arrayContaining([
				'<!--my_custom_prefix.name:value-->',
				'.name',
				'value',
			])
			expect(act).toEqual(exp)
		})

		test('Nested node', () => {
			const act = regexp.newHtml().exec('<!--p23.group.name:value-->')
			const exp = expect.arrayContaining([
				'<!--p23.group.name:value-->',
				'.group.name',
				'value',
			])
			expect(act).toEqual(exp)
		})

		test('Messed up but valid node names', () => {
			const act = regexp
				.newHtml()
				.exec('<!--p23.$$$12313___.__dsfjk12$$6389__$$:value-->')
			const exp = expect.arrayContaining([
				'<!--p23.$$$12313___.__dsfjk12$$6389__$$:value-->',
				'.$$$12313___.__dsfjk12$$6389__$$',
				'value',
			])
			expect(act).toEqual(exp)
		})

		test('Empty value still returns entry', () => {
			const act = regexp.newHtml().exec('<!--p23.name:-->')
			const exp = expect.arrayContaining(['<!--p23.name:-->', '.name', ''])
			expect(act).toEqual(exp)
		})

		test('Fails if number first in node name', () => {
			const act = regexp.newHtml().exec('<!--p23.1name:value-->')
			expect(act).toEqual(null)
		})

		test('Fails if missing node name', () => {
			const act = regexp.newHtml().exec('<!--p23:value-->')
			expect(act).toEqual(null)
		})

		test('Fails if missing node name (version two)', () => {
			const act = regexp.newHtml().exec('<!--p23.:value-->')
			expect(act).toEqual(null)
		})

		test('Fails if missing colon', () => {
			const act = regexp.newHtml().exec('<!--p23.name-->')
			expect(act).toEqual(null)
		})
	})
})
