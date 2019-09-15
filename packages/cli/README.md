# @make-mjs/cli

Command-line function and executable

## Usage

```
make-mjs [options] <directories>

Options:
  --version           Show version number                              [boolean]
  --knownMjsPackages  Names of packages that should support mjs          [array]
  --help              Show help                                        [boolean]
```

## Example

Let's say you have the following files:

```
.
├── foo.js
├── bar.js
└── baz.js
```

Run this command:

```sh
make-mjs .
```

You should get this:

```diff
.
+├── foo.mjs
 ├── foo.js
+├── bar.mjs
 ├── bar.js
+├── baz.mjs
 └── baz.js
```

## License

[MIT](https://git.io/JeY5b) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
