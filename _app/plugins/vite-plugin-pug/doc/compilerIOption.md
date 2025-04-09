# Pug compiler options

## 目次

[TOC]

## Optionの概要  
このoptionでは、pug関数のコンパイラーオプションに渡される設定をすることができます。  
  
### Default Configuration  
```typescript
const Options = {
    filename: "Pug",
    pretty: false,
    filters: undefined,
    self: false,
    compileDebug: true,
    cache: false,
    inlineRuntimeFunctions: true,
    name: "template"
}
```

### Pug Options
#### `filename`
- type: `string` | `undefined`
- default: `Pug`

コンパイル中のファイルの名前を指定できます。  
例外で使用され、相対的な組み込みおよび拡張に必要です。

#### `basedir`
- type: `string` | `undefined`
- default: `undefined`

pugのルートディレクトリを指定できます。

> ex)
> ```
> .
> └── src
>     ├── components
>     │   └── cells
>     │       └── Layout.pug
>     └──pages
>        └── index.pug
> ```
> ```typescript
> vitePug({
>   options: {
>     basedir: `src/components`
>   }
> })
> ```
> src/pages/index.pug
> ```pug
> extend cell/Layout.pug
> ```


#### `doctype`
- type: `string` | `undefined`
- default: `undefined`

doctype がテンプレートの一部として指定されていない場合は、ここで指定できます。  
詳細については、doctypeのドキュメントを参照してください。

#### `pretty`
- type: `boolean` | `string` | `undefined`
- default: `false`

出力するのHTMLに空白を追加し、インデントとして「 」を使用して人間が読みやすくします。  
文字列が指定されている場合は、代わりにそれがインデントとして使用されます (例: '\t')。

#### `filters`
- type: `any`
- default: `undefined`

カスタムフィルターのハッシュテーブルを指定します。  
参照) [Filters - pug](https://pugjs.org/language/filters.html)  
  
#### `self`
- type: `boolean` | `undefined`
- default: `false`

自己名前空間を使用してローカルを保持します。  
これによりコンパイルが高速化されますが、locals オブジェクトのプロパティにアクセスするには、変数を記述する代わりに self.variable を記述する必要があります。


#### `debug`
- type: `boolean` | `undefined`
- default: `undefined`

true に設定すると、トークンと関数本体がコンソールに出力されます。

#### `compileDebug`
- type: `boolean` | `undefined`
- default: `true`

true に設定すると、エラー メッセージを改善するために関数ソースがコンパイルされたテンプレートに組み込まれます (開発時に役立つ場合があります)。  
本番モードの Express で使用しない限り、デフォルトで有効になります。

#### `globals`
- type: `Array<String>` | `undefined`
- default: `undefined`

グローバル名のリストを追加して、それぞれのpugファイルでアクセスできるようにします。

#### `cache`
- type: `boolean` | `undefined`
- default: `false`

true に設定すると、コンパイルされた関数がキャッシュされます。  
ファイル名をキャッシュキーとして設定する必要があります。  
レンダリング関数にのみ適用されます。

#### `inlineRuntimeFunctions`
- type: `boolean` | `undefined`
- default: `false`

ランタイム関数を共有バージョンから要求するのではなく、インライン化します。