# @make-mjs/file

Turn a Babel JavaScript file into a MJS file

## Example

Let's say you have `./lib/foo.js` and `./lib/bar.js` and this file (named `index.js`):

```javascript
export * from './lib/foo'
export * from './lib/bar'
```

You run this command:

```typescript
import fs from 'fs'
import transformCode from '@make-mjs/file'
const input = fs.readFileSync('index.js', 'utf8')
const output = transformCode(code, { moduleContainer: ['node_modules'] }).code
fs.writeFileSync('index.mjs', output)
```

You should get this file (named `index.mjs`):

```javascript
export * from './lib/foo.mjs'
export * from './lib/bar.mjs'
```

## License

[MIT](https://git.io/JeY5b) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
