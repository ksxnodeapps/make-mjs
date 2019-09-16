# Collection of `@make-mjs` packages

## Purpose

This is a collection of packages that help turn a normal Babel JavaScript file that uses ES module `import` syntax into a `.mjs` file that `import`s exact URL.

## Packages

* [@make-mjs/cli](https://www.npmjs.com/package/@make-mjs/cli): Command-line interfaces
* [@make-mjs/main](https://www.npmjs.com/package/@make-mjs/main): APIs to compile a directory
* [@make-mjs/file](https://www.npmjs.com/package/@make-mjs/file): APIs to compile a file
* [@make-mjs/path](https://www.npmjs.com/package/@make-mjs/path): APIs to transform an import/export URL
* [and more...](https://www.npmjs.com/org/make-mjs)

## Development

### System Requirements

* Node.js ≥ 10.16.3
* Package Manager: [pnpm](https://pnpm.js.org/)
* Git

### Scripts

#### Build

```sh
pnpm run build
```

#### Clean

```sh
pnpm run clean
```

#### Test

##### Test Everything

```sh
pnpm test
```

##### Test Changed Files Only

```sh
pnpm test -- --onlyChanged
```

##### Test A Single File

```sh
pnpm test path/to/test/file.test.ts
```

or

```sh
pnpm test filename.test.ts
```

##### Update Jest Snapshot

```sh
pnpm test -- -u
```

#### Start Node.js REPL

This starts a Node.js REPL where you can import every module inside `packages/` folder.

```sh
pnpm run repl
```

## License

[MIT](https://git.io/JeY5b) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
