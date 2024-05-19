# P23

A simple tool for adding parsable metadata as comments within Svelte components.

## Made to be Plundered

Do whatever you like as long as you adhere to the permissive MIT license found within.

## Example

```html
<script>
  // BartSimpson.svelte

  //p23.ay_caramba: A node with the name (path) 'caramba'.

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

```js
import p23 from 'p23'

// Defaults to glob: **/*.svelte
const metadata = p23()

// Approximately!
const metadata = [
  {
    name: "BartSimpson.svelte",
    relPath: "./src/lib/BartSimpson.svelte",
    absPath: "/home/esmerelda/github/my-project/src/lib/BartSimpson.svelte",
    nodes: {
      ay_caramba: " A metadata node with the name (path) 'ay_caramba'.",
      eat: {
        my: {
          shorts: "\n    A block node with multiple path segments.\n  "
        }
      },
      js: {
        multiline:  "\n An unbroken\n\n series of\n\n single line comments."
      },
      html: {
        line: " P23 will parse HTML comments too.",
        block: "\n    That includes\n    multiline block comments.\n  ",
      }
    }
  }
]
```

For information on glob and glob options see [NPM _glob_ package](https://www.npmjs.com/package/glob) ([Github](https://github.com/isaacs/node-glob)). I should hide this library behind the API, as an implementation detail, but CBA for version one.

```js
import p23 from 'p23'

p23({
  // Custom prefix for nodes. 
  prefix: "p23",

  // See https://github.com/isaacs/node-glob 
  glob: "**/*.svelte",

  // See https://github.com/isaacs/node-glob
  globOptions: {}
})
```

## Notes

1. Handling linefeeds and whitespace is your responsibility.
2. The one exception to _Note 1_ are nodes created from a series of unbroken line comments. The leading whitespace and `//` are removed from each line (only because they would be difficult to remove by the user after parsing).
3. Path segments must adhere to: `^[$a-zA-Z_][$a-zA-Z_0-9]*$` (this could be extended to include any character allowed within an object field name).
4. Yes, it will parse block comments in CSS nodes too.
4. "Don't have a cow, Man!" - Bart Simpson
