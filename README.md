# pastas

Simple, TypeScript-friendly, type-safe command parser module

```ts
import { pastas, string, boolean, number } from 'pastas'

const [args, options] = pastas(process.argv.slice(2), [
  string,
  number
], {
  foo: boolean,
  F: 'foo' // Alias
})

console.log(args) // ['Hello World', 123]
console.log(options) // { foo: true }
```
