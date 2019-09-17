# @make-mjs/url

Manipulate MJS module URL

## Examples

### Internal Modules

```typescript
import getMjsUrl from '@make-mjs/url'

const mjsPath: string = await getMjsUrl({
  modulePath: './foo/bar/baz', // leading '.' or '..' is required to be recognized as internal
  /* ...and more options... */
})
```

**Result:**

* If `./foo/bar/baz` points to a directory without a `package.json`, `mjsPath` would be `./foo/bar/baz/index.mjs`.
* If `./foo/bar/baz` does not point to a directory, `mjsPath` would be `./foo/bar/baz.mjs`.
* For other cases, read the [tests](https://github.com/ksxnodeapps/make-mjs/blob/5cfc5a1fb850a0d5787a1bdc143ce913b57b39e4/test/path/get-mjs-path.test.ts).

### External Modules

```typescript
import getMjsUrl from '@make-mjs/url'

const mjsPath: string = await getMjsUrl({
  modulePath: 'foo/bar/baz',
  moduleContainer: [
    'node_modules'
  ],
  /* ...and more options... */
})
```

**Result:**

* If `node_modules/foo/bar/baz` points to a directory without a `package.json`, `mjsPath` would be `foo/bar/baz/index.mjs`.
* If `node_modules/foo/bar/baz` points to a directory that contains a `package.json` that have `"module"` points to `module.mjs`, `mjsPath` would be `foo/bar/baz/module.mjs`.
* If `node_modules/foo/baz.js` points to a file, `mjsPath` would be `foo/bar/baz.mjs`.
* For other cases, read the [tests](https://github.com/ksxnodeapps/make-mjs/blob/5cfc5a1fb850a0d5787a1bdc143ce913b57b39e4/test/path/get-mjs-path.test.ts).

## License

[MIT](https://git.io/JeY5b) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
