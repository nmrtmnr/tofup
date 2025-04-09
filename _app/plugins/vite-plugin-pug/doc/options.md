<h1>Plugin Options</h1>

<h2>目次</h2>

[TOC]

<h2>Optionの概要</h2>

<h3>Default Configuration</h3>

```typescript
const defaultOptions = {
  view: "pages",
  base: "./src",
  src: "/**/*.pug",
  options: {},
  data: {}
};
```

<h3>Plugin Options</h3>

#### `view`
- type: `string`
- default: `pages`

ページルーティングのターゲットとなるディレクトリを指定します。

#### `base`
- type: `string`
- default: `./src/`

pugが参照するファイルが存在するディレクトリを指定します。

#### `src`
- type: `string`
- default: ` /**/*.pug`

`view`で指定したファイルの中で、glob形式でフィルタリングをかけれます。<br/>デフォルトでは全てのpugファイルを参照します。

#### `options`
- type: `object`
- default: ` {}`

pugをコンパイルする上でのoptionを渡すことができます。

#### `data`
- type: `object`
- default: ` {}`

pug内で使用できるglobalなデータを渡すことができます。