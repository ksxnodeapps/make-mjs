# @make-mjs/main

Main program

## Usage

```typescript
import main, { EventType } from '@make-mjs/main'

// main() returns an async iterator
const events = main({
  dirname: 'src',
  /* ...and more options... */
})

for await (const event of events) {
  if (event.type === EventType.BeforeWrite) {
    console.log('Writing to file:', event.file.path)
  }

  if (event.type === EventType.AfterWrite) {
    console.log('Complete writing:', event.file.path)
  }
}
```

## License

[MIT](https://git.io/JeY5b) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
