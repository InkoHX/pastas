# pastas

Simple, TypeScript-friendly, type-safe command parser module

```ts
import { pastas, string, boolean, number } from 'pastas'

const [args, options] = pastas(
  process.argv.slice(2),
  [string, number] as const,
  {
    foo: boolean,
    F: 'foo', // Alias
  }
)

const { foo = false } = options

console.log(args) // ['Hello World', 123]
console.log(foo) // true if with "-F" or "--foo".
```
