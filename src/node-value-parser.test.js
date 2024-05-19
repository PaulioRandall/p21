import parseNodeValue from './node-value-parser.js'

describe('node-value-parser.js', () => {
	describe('parseNodeValue', () => {
		describe('HTML block', () => {
			test('One liner', () => {
				const act = parseNodeValue('<!--p23.name: value -->')
				expect(act).toEqual(' value ')
			})

			test('Multiple lines', () => {
				const act = parseNodeValue(`<!--p23.name:
				one
				two
				three
			-->`)
				expect(act).toEqual(`
				one
				two
				three
			`)
			})
		})

		describe('JavaScript block', () => {
			test('One liner', () => {
				const act = parseNodeValue('/*p23.name: value */')
				expect(act).toEqual(' value ')
			})

			test('Multiple lines', () => {
				const act = parseNodeValue(`/*p23.name:
				one
				two
				three
			*/`)
				expect(act).toEqual(`
				one
				two
				three
			`)
			})
		})

		describe('JavaScript line & line block', () => {
			test('One liner', () => {
				const act = parseNodeValue('//p23.name: value ')
				expect(act).toEqual(' value ')
			})

			test('Line block with content starting on initial line', () => {
				const act = parseNodeValue(`//p23.name: zero
// one`)
				expect(act).toEqual(` zero
 one`)
			})

			test('Line block with content starting on second line', () => {
				const act = parseNodeValue(`//p23.name:
  // one
  //
  // three`)
				expect(act).toEqual(`
 one

 three`)
			})
		})
	})
})
