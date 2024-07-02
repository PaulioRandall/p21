import clean from './node-cleaner.js'

const lines = (...s) => s.join('\n')

describe('node-cleaner.js', () => {
	test('JS single line', () => {
		const given = {
			nodes: {
				artist: ['	//p23.artist Rhapsody of Fire'],
			},
		}

		const act = clean([given])

		const exp = [
			{
				nodes: {
					artist: [' Rhapsody of Fire'],
				},
			},
		]

		expect(act).toEqual(exp)
	})

	test('JS multiline', () => {
		const givenNode = lines(
			'	//p23.artist first', //
			'	// a',
			'	// 	b',
			'	// 		c'
		)

		const act = clean([
			{
				nodes: {
					artist: [givenNode],
				},
			},
		])

		const expNode = lines(
			' first', //
			'a',
			'	b',
			'		c'
		)

		const exp = [
			{
				nodes: {
					artist: [expNode],
				},
			},
		]

		expect(act).toEqual(exp)
	})

	test('JS block', () => {
		const givenNode = lines(
			'	/*p23.artist first', //
			'		a',
			'			b',
			'				c',
			'	 * d',
			'	  e',
			'	*/'
		)

		const act = clean([
			{
				nodes: {
					artist: [givenNode],
				},
			},
		])

		const expNode = lines(
			' first', //
			'a',
			'	b',
			'		c',
			'd',
			'e',
			''
		)

		const exp = [
			{
				nodes: {
					artist: [expNode],
				},
			},
		]

		expect(act).toEqual(exp)
	})

	test('HTML block', () => {
		const givenNode = lines(
			'	<!--p23.artist first', //
			'	 a',
			'	 	b',
			'	 		c',
			'	  e',
			'	-->'
		)

		const act = clean([
			{
				nodes: {
					artist: [givenNode],
				},
			},
		])

		const expNode = lines(
			' first', //
			'a',
			'	b',
			'		c',
			' e',
			''
		)

		const exp = [
			{
				nodes: {
					artist: [expNode],
				},
			},
		]

		expect(act).toEqual(exp)
	})

	test('HTML block tab indent', () => {
		const givenNode = lines(
			'	<!--p23.artist first', //
			'		a',
			'		b',
			'	-->'
		)

		const act = clean([
			{
				nodes: {
					artist: [givenNode],
				},
			},
		])

		const expNode = lines(
			' first', //
			'a',
			'b',
			''
		)

		const exp = [
			{
				nodes: {
					artist: [expNode],
				},
			},
		]

		expect(act).toEqual(exp)
	})
})
