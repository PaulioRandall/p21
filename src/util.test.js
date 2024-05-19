import util from './util.js'

describe('util.js', () => {
	describe('parseHtmlBlockValue', () => {
		test('TODO', () => {
			const act = util.parseHtmlBlockValue('<!--p23.name: value -->')
			expect(act).toEqual('value')
		})

		test('TODO', () => {
			const act = util.parseHtmlBlockValue(`<!--p23.name:
				one
				two
				three
			-->`)
			expect(act).toEqual(`one
				two
				three`)
		})
	})

	describe('parseNodeValue', () => {
		test('TODO', () => {
			const act = util.parseNodeValue('<!--p23.name: value -->')
			expect(act).toEqual('value')
		})
	})
})
