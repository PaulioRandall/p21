![Made to be Plundered](https://img.shields.io/badge/Made%20to%20be%20Plundered-royalblue)
[![Latest version](https://img.shields.io/github/v/release/PaulioRandall/p23)](https://github.com/PaulioRandall/p23/releases)
[![Release date](https://img.shields.io/github/release-date/PaulioRandall/p23)](https://github.com/PaulioRandall/p23/releases)

# P23

Simple tool for parsing referenceable comments within Svelte components.

## Made to be Plundered

Fork, pillage, and plunder! Do whatever as long as you adhere to the project's permissive MIT license.

## Examples

Given the component:

```html
<!-- BartSimpson.svelte -->

<script>
  //p23.ay_caramba A node with the name (or path) 'ay_caramba'.

  /*p23.eat.my.shorts
    A block node with multiple path segments.
  */

  /*p23.eat.my.shorts
    Nodes with the same are presented in order as you'll see.
  */

  //p23.js.multiline
  // An unbroken
  // series of
  //
  // single line comments.
</script>

<div>
  <!--p23.html.line P23 will parse HTML comments too. -->
  <slot />

  <!--p23.html.block
    That includes
    multiline block comments. 
  -->
</div>
```

When parsed with:

```js
import p23 from 'p23'

const fileDocs = p23()
```

Then `fileDocs` will be something like:

```js
[
  {
    name: "BartSimpson.svelte",
    relPath: "./src/lib/BartSimpson.svelte",
    absPath: "/home/esmerelda/github/my-project/src/lib/BartSimpson.svelte",
    nodes: {
      ay_caramba: ["//p23.ay_caramba A node with the name (path) 'ay_caramba'."],
      eat: {
        my: {
          shorts: [`/*p23.eat.my.shorts
    A block node with multiple path segments.
  */`, `/*p23.eat.my.shorts
    Nodes with the same are presented in order as you'll see.
  */`]
        }
      },
      js: {
        multiline: [`//p23.js.multiline
  // An unbroken
  // series of
  //
  // single line comments.`]
      },
      html: {
        line: [`<!--p23.html.line P23 will parse HTML comments too. -->`],
        block: [`<!--p23.html.block
    That includes
    multiline block comments. 
  -->`],
      }
    }
  }
]
```

**To parse and clean nodes:**

```js
import p23, { cleanNodes } from 'p23'

const files = p23()
const fileDocs = cleanNodes(files)
```

Cleaning removes the P23 delimiter and leading whitespace from lines. Whitespace filtering is opinionated:

- The first line determines the base indent.
- For each JS and CSS block comment line other than the first:
  - The base indent is removed.
  - Either ` * `, tabs, or two sequential spaces are removed if found.
- For each JS multiline comment line other than the first:
  - The base indent is removed.
  - A single space is removed if found.
- For each HTML comment line other than the first:
  - The base indent is removed.
  - A tab or single space is removed if found.

```js
[
  {
    name: "BartSimpson.svelte",
    relPath: "./src/lib/BartSimpson.svelte",
    absPath: "/home/esmerelda/github/my-project/src/lib/BartSimpson.svelte",
    nodes: {
      ay_caramba: ["A node with the name (path) 'ay_caramba'."],
      eat: {
        my: {
          shorts: [`
A block node with multiple path segments.
  `, `
Nodes with the same are presented in order as you'll see.
  `]
        }
      },
      js: {
        multiline: [`
An unbroken

series of

single line comments.`]
      },
      html: {
        line: [` P23 will parse HTML comments too. `],
        block: [`
That includes
multiline block comments. 
  `],
      }
    }
  }
]
```

## Usage Notes

1. Doc strings include the comment delimters unless cleaned with `cleanNodes` or by your own means.
2. Cleaning and managing other whitespace in node values is your responsibility.
3. Path segments must adhere to: `^[$@a-zA-Z_][$@a-zA-Z0-9_\-]*$`. This list may be extended in future to include **almost** any string character.
4. Nodes with the same name are in order of appearance within the file.
5. Yes, it will parse block comments in CSS nodes too.
6. "Don't have a cow, Man!"

## Options

Defaults noted as field values. 

For information on glob and glob options see [NPM _glob_ package](https://www.npmjs.com/package/glob) ([Github](https://github.com/isaacs/node-glob)). I should hide this library behind the API, but CBA at least for the first version.

```js
import p23 from 'p23'

p23({
  // Custom prefix for nodes.
  // You could use "@" to parse "//@name: value" for example.
  prefix: "p23.",

  // For SvelteKit packaged libraries you would use
  // "dist/*.svelte" or some variation of it.
  glob: "**/*.svelte",
  globOptions: {}
})
```

## Back Story

I simply wanted to document a component's API within itself and regenerate that documentation in a form I please, particularly within a README. To clarify, I want to document the **interface** (API) to the component by documenting its single implementation. Ths includes details such as name, description, module & instance properties, slots, set context, and defaults where applicable.

A few documentation tools come close but none completely satisfy my need for simplicity, readability, flexibility, and ability to document all mentioned aspects of the API. Furthermore, existing tools traded-off too much flexibility for conciseness. So I set about creating [**P24**](https://github.com/PaulioRandall/p24). In the process I was able to separate the concern of parsing annotated comments into **P23**.

To clarify, **P23** is not about documenting components (**P24** does that). It is about specifying parsable comments within Svelte components. The output can then be used by a documentation package or some other innovative tooling. For example, you could build a changelog package where maintainers write changes to a component within the component. The package could render them in a similar manner to how **P24** does with API documentation.
