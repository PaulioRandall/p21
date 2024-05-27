import cleanFileNode, { parseNodeValue } from './clean-file-node.js'

describe('clean-file-node.js', () => {
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

	describe('cleanFileNode', () => {
		const act = cleanFileNode({
			nodes: {
				initial: ['//p23.initial: Mr '],
				name: ['/*p23.name: Smith */'],
				age: ['<!--p23.age: 24 -->'],
			},
		})

		const exp = {
			nodes: {
				initial: [' Mr '],
				name: [' Smith '],
				age: [' 24 '],
			},
		}

		expect(act).toEqual(exp)
	})
})
