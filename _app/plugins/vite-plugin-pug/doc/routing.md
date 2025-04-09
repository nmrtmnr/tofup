<h1>Routing Logic</h1>

<h2>目次</h2>

[TOC]

## Routingの仕組み


`vite-plugin-pug`のルーティングは、`Nuxt.js`/`Next.js`/`SvelteKit`/`SolidStart`のようなファイルシステムベースです。  
`src/pages`(default時)にあるファイルやディレクトリは、アプリケーションのルーティングの役割を担っています 。


- `Directory`: ルーターがマッチさせるURLセグメントを定義します。
- `*.pug` files: ページを定義します。  

>ex)  
> **HTTP Request**: `https://example.com/about/company`  
> **Directories**:  
> ```
> src
> └── pages
>     └── about
>         ├── company
>         │   └── index.pug ← このpugが表示される
>         └── products
>             └── index.pug
> ```  

## カスタマイズ

プラグインオプションの`view`へ値を渡すことで、ルーティングのターゲットとなるディレクトリを変更することができます。  
  
> ex)  
> ```typescript
> export default defineConfig({
>   plugins: [vitePug({
>     view: "routes"
>   })]
> })
> ```
> ```
> src
> └── routes ← 配下のファイルがルーティングとして使用される
>     └── about
>         ├── company
>         │   └── index.pug
>         └── products
>             └── index.pug
> ```  