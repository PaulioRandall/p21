import parseNodes from './node-parser.js'

describe('node-parser.js', () => {
	test('No docs', () => {
		const given = {
			content: `<div />
`,
		}

		const act = parseNodes([given])

		const exp = [
			{
				...given,
				nodes: {},
			},
		]

		expect(act).toEqual(exp)
	})

	test('JS non-nested lines', () => {
		const given = {
			content: `<script>
	//p23.artist Rhapsody of Fire
</script>
`,
		}

		const act = parseNodes([given])

		const exp = [
			{
				...given,
				nodes: {
					artist: ['	//p23.artist Rhapsody of Fire'],
				},
			},
		]

		expect(act).toEqual(exp)
	})

	test('JS multi line', () => {
		const given = {
			content: `<script>
	//p23.name Meh
	//p23.description Abc
	// a
	// b
	//
	// y
	// z
</script>
`,
		}

		const act = parseNodes([given])

		const exp = [
			{
				...given,
				nodes: {
					name: ['	//p23.name Meh'],
					description: [
						`	//p23.description Abc
	// a
	// b
	//
	// y
	// z`,
					],
				},
			},
		]

		expect(act).toEqual(exp)
	})

	test('Many non-nested JS lines', () => {
		const given = {
			content: `<script>
	//p23.artist Rhapsody of Fire
	//p23.album From Chaos to Eternity
	//p23.release_date 2011-06-17
</script>
`,
		}

		const act = parseNodes([given])

		const exp = [
			{
				...given,
				nodes: {
					artist: ['	//p23.artist Rhapsody of Fire'],
					album: ['	//p23.album From Chaos to Eternity'],
					release_date: ['	//p23.release_date 2011-06-17'],
				},
			},
		]

		expect(act).toEqual(exp)
	})

	test('Nested JS lined', () => {
		const given = {
			content: `<script>
	//p23.bands.artist Rhapsody of Fire
</script>
`,
		}

		const act = parseNodes([given])

		const exp = [
			{
				...given,
				nodes: {
					bands: {
						artist: ['	//p23.bands.artist Rhapsody of Fire'],
					},
				},
			},
		]

		expect(act).toEqual(exp)
	})

	test('JsLine_Nested_2.svelte', () => {
		const given = {
			content: `<script>
	//p23.music.bands.artist Rhapsody of Fire
</script>
`,
		}

		const act = parseNodes([given])

		const exp = [
			{
				...given,
				nodes: {
					music: {
						bands: {
							artist: ['	//p23.music.bands.artist Rhapsody of Fire'],
						},
					},
				},
			},
		]

		expect(act).toEqual(exp)
	})

	test('JsLine_Complex.svelte', () => {
		const given = {
			content: `<script>
	//p23.type Music
	//p23.music.type Band
	//p23.music.band.genre Symphonic Power Metal
	//p23.music.band.name Rhapsody of Fire
	//p23.music.band.albums [
	// "Rhapsody of Fire",
	// "Triumph or Agony",
	// ]
</script>
`,
		}

		const act = parseNodes([given])

		const exp = [
			{
				...given,
				nodes: {
					type: ['	//p23.type Music'],
					music: {
						type: ['	//p23.music.type Band'],
						band: {
							name: ['	//p23.music.band.name Rhapsody of Fire'],
							genre: ['	//p23.music.band.genre Symphonic Power Metal'],
							albums: [
								`	//p23.music.band.albums [
	// "Rhapsody of Fire",
	// "Triumph or Agony",
	// ]`,
							],
						},
					},
				},
			},
		]

		expect(act).toEqual(exp)
	})

	test('Option prefix', () => {
		const given = {
			content: `<script>
	//@artist Rhapsody of Fire
</script>
`,
		}

		const act = parseNodes([given], { prefix: '@' })

		const exp = [
			{
				...given,
				nodes: {
					artist: ['	//@artist Rhapsody of Fire'],
				},
			},
		]

		expect(act).toEqual(exp)
	})

	test('HTML nodes', () => {
		const given = {
			content: `<!--p23.music.band.genre Symphonic Power Metal-->

<div>
	<!--p23.music.band.name Rhapsody of Fire-->
</div>

<!--p23.music.band.albums
	[
		"Rhapsody of Fire",
		"Triumph or Agony",
	]
-->
`,
		}

		const act = parseNodes([given])

		const exp = [
			{
				...given,
				nodes: {
					music: {
						band: {
							name: ['	<!--p23.music.band.name Rhapsody of Fire-->'],
							genre: ['<!--p23.music.band.genre Symphonic Power Metal-->'],
							albums: [
								`<!--p23.music.band.albums
	[
		"Rhapsody of Fire",
		"Triumph or Agony",
	]
-->`,
							],
						},
					},
				},
			},
		]

		expect(act).toEqual(exp)
	})

	test('JS block, single line', () => {
		const given = {
			content: `<script>
	/*p23.artist Rhapsody of Fire*/
</script>
`,
		}

		const act = parseNodes([given])

		const exp = [
			{
				...given,
				nodes: {
					artist: ['	/*p23.artist Rhapsody of Fire*/'],
				},
			},
		]

		expect(act).toEqual(exp)
	})

	test('JS Block, multiline', () => {
		const given = {
			content: `<script>
	/*p23.artist
		Rhapsody of Fire
	*/
</script>
`,
		}

		const act = parseNodes([given])

		const exp = [
			{
				...given,
				nodes: {
					artist: [
						`	/*p23.artist
		Rhapsody of Fire
	*/`,
					],
				},
			},
		]

		expect(act).toEqual(exp)
	})

	test('Same node multiple times', () => {
		const given = {
			content: `<script>
	//p23.name Alice
	//p23.name Bob
	//p23.name Charlie
</script>
`,
		}

		const act = parseNodes([given])

		const exp = [
			{
				...given,
				nodes: {
					name: [
						'	//p23.name Alice', //
						'	//p23.name Bob',
						'	//p23.name Charlie',
					],
				},
			},
		]

		expect(act).toEqual(exp)
	})
})
