# P23

Simple tool for adding parsable notes as comments within Svelte components.

## Made to be Plundered

Do whatever as long as you adhere to the permissive MIT license found within.

## Examples

**Given:**

```html
<!-- BartSimpson.svelte -->

<script>
  //p23.ay_caramba: A node with the name (path) 'ay_caramba'.

  /*p23.eat.my.shorts:
    A block node with multiple path segments.
  */

  //p23.js.multiline:
  // An unbroken
  //
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
  //
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
4. Yes, it will parse block comments in CSS nodes too.
5. "Don't have a cow, Man!" - Bart Simpson

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
