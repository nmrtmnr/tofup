<div align="center">
<img src="./img-logo.png" alt="logo" width="500" style="max-width: 500px;"/>
</div>
<div align="center">
<h1>
@ist-tech/vite-plugin-pug
</h1>
</div>

<h2>目次</h2>

[TOC]

<h2>Minimum Requirements</h2>
[Node.js version 16 or higher](https://nodejs.org/en)

<h2>Getting Started</h2>

<h3>認証情報の追加</h3>
このnpmライブラリはプライベートリポジトリのため、認証情報を登録しなければインストールすることはできません。  
よって、以下の手順に沿って認証設定を行なってください。  
  
#### プロジェクトスコープで設定ファイルを設置する方法
以下ファイルをプロジェクトルート直下に設置してください。

.npmrc▼
```.npmrc
@ist-tech:registry=https://i-studio.commits.jp/api/v4/projects/2409/packages/npm/
//i-studio.commits.jp/api/v4/projects/2409/packages/npm/:_authToken={発行したトークン}
```

#### PCに対して認証設定をする方法
```bash
$ npm config set @ist-tech:registry=https://i-studio.commits.jp/api/v4/projects/2409/packages/npm/
$ npm config set -- '//i-studio.commits.jp/api/v4/projects/2409/packages/npm/:_authToken' "{発行したトークン}"
```

<h3>インストール</h3>

```bash
$ npm i -D @ist-tech/vite-plugin-pug vite
# or
$ yarn add -D @ist-tech/vite-plugin-pug vite
# or
$ pnpm add -D @ist-tech/vite-plugin-pug vite
```

<h3>設定</h3>

<h4>vite.config.ts</h4>

```bash
$ cd /path/to/project/root/
$ touch vite.config.ts
```

```typescript
/* vite.config.ts */
import {defineConfig} from "vite";
import vitePug from "@ist-tech/vite-plugin-pug";

export default defineConfig({
  plugins: [
    vitePug()
  ]
})
```

<h4>package.jsonの修正</h4>

```jsonc
// package.json
{
    "scripts": {
        // 追加
        "start": "vite --open",
        "build": "vite build"
    }
}
```

<h4>pugファイルの追加</h4>

```bash
$ mkdir -p ./src/pages
$ touch ./src/pages/index.pug
```

```pug
// src/pages/index.pug
doctype html
html
    head
        title vite-plugin-pug
    body
        h1 Hello, Pug!
```

<h4>ローカルサーバーの起動</h4>

```bash
$ npm run start
```

<h2>Docs</h2>

- [Options](./doc/options.md)
  - [compilerIOption](./doc/compilerIOption.md)
  - [globalData](./doc/data.md)
- [Routing](./doc/routing.md)
