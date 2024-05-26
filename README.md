![Made to be Plundered](https://img.shields.io/badge/Made%20to%20be%20Plundered-royalblue)
[![Latest version](https://img.shields.io/github/v/release/PaulioRandall/p23)](https://github.com/PaulioRandall/p23/releases)
[![Release date](https://img.shields.io/github/release-date/PaulioRandall/p23)](https://github.com/PaulioRandall/p23/releases)

# P23

Simple tool for adding parsable notes as comments within Svelte components.

## Made to be Plundered

Do whatever as long as you adhere to the permissive MIT license found within.

## Examples

**Given:**

```html
<!-- BartSimpson.svelte -->

<script>
  //p23.ay_caramba: A node with the name (or path) 'ay_caramba'.

  /*p23.eat.my.shorts:
    A block node with multiple path segments.
  */

  //p23.js.multiline:
  // An unbroken
  // series of
  //
  // single line comments.
</script>

<div>
  <!--p23.html.line: P23 will parse HTML comments too. -->
  <slot />

  <!--p23.html.block:
    That includes
    multiline block comments. 
  -->
</div>
```

**To Parse raw nodes:**

```js
import p23 from 'p23'

const fileDocs = p23()
```

```js
fileDocs == [
  {
    name: "BartSimpson.svelte",
    relPath: "./src/lib/BartSimpson.svelte",
    absPath: "/home/esmerelda/github/my-project/src/lib/BartSimpson.svelte",
    nodes: {
      ay_caramba: "//p23.ay_caramba: A node with the name (path) 'ay_caramba'.",
      eat: {
        my: {
          shorts: `/*p23.eat.my.shorts:
    A block node with multiple path segments.
  */`
        }
      },
      js: {
        multiline: `//p23.js.multiline:
  // An unbroken
  // series of
  //
  // single line comments.`
      },
      html: {
        line: `<!--p23.html.line: P23 will parse HTML comments too. -->`,
        block: `<!--p23.html.block:
    That includes
    multiline block comments. 
  -->`,
      }
    }
  }
]
```

**To parse and clean nodes:**

```js
import p23, { cleanFileNode } from 'p23'

const fileDocs = p23().map(cleanFileNode)
```

Note that cleaning doesn't alter whitespace. Because I have no idea what kind of whitespace formatting someone may use. Multiline comments have a minor exception where the leading whitespace and prefix `//` are removed.

```js
fileDocs == [
  {
    name: "BartSimpson.svelte",
    relPath: "./src/lib/BartSimpson.svelte",
    absPath: "/home/esmerelda/github/my-project/src/lib/BartSimpson.svelte",
    nodes: {
      ay_caramba: " A node with the name (path) 'ay_caramba'.",
      eat: {
        my: {
          shorts: `
    A block node with multiple path segments.
  `
        }
      },
      js: {
        multiline: `
 An unbroken

 series of

 single line comments.`
      },
      html: {
        line: ` P23 will parse HTML comments too. `,
        block: `
    That includes
    multiline block comments. 
  `,
      }
    }
  }
]
```

## Usage Notes

1. Doc strings include the comment delimters unless cleaned with `cleanFileNode` or by your own means.
2. Cleaning and managing the whitespace in node values is your responsibility.
3. Path segments must adhere to: `^[$@a-zA-Z_][$@a-zA-Z0-9_\-]*$`. This list may be extended in future to include almost any string character.
4. If two or more nodes with the same name are in the same component the last one in the document is returned (no support for multiple same name nodes yet).
5. Yes, it will parse block comments in CSS nodes too.
6. "Don't have a cow, Man!" - Bart Simpson

## Options

Defaults noted as field values. 

For information on glob and glob options see [NPM _glob_ package](https://www.npmjs.com/package/glob) ([Github](https://github.com/isaacs/node-glob)). I should hide this library behind the API, as an implementation detail, but CBA for the time being.

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

I simply wanted to document a component's API within itself and regenerate that documentation in a form I please, particularly within a README. To clarify, I want to document the **interface** (API) to the component by documenting its single implementation. Ths includes details such as: name, description, module & instance properties, slots, set context, and defaults where applicable.

A few documentation tools come close but none completely satisfy my need for simplicity, readability, flexibility, ability to document all mentioned aspects of the API. Furthermore, existing tools traded-off too much flexibility for conciseness. So I set about creating [**P24**](https://github.com/PaulioRandall/p24). In the process I was able to separate the concern of parsing annotated comments as this library, **P23**.

To clarify, **P23** is not about documenting components (**P24** does that). It is about specifying parsable comments within Svelte components. The output can then be used by a documentation package or some other innovative tooling. For example, you could build a changelog package where maintainers write changes to a component within the component. The package could render them in a similar manner to how **P24** does with API documentation.

## Fore Story

Version 2 could include support for multiple instances of the same node. The last specified value will be used if multiple nodes with the same name are parsed within a single component. The node values could go into an array instead, similar to query parameter parsing in some libraries.
