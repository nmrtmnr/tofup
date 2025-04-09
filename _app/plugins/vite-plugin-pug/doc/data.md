# Pug Data

## 目次

[TOC]

## dataの概要  
  
pugファイル全体で使用できるデータを渡すことができます。  
.jsonや、js/tsで記述したobjectなどをpug内で使用することができます。

## 使用例  
  
**config**
```typescript
/* data.ts */
export default {
  meta: {
    title: "vite x pug",
  },
  hoge: "fuga",
  bar: "foo",
};

/* vite.config.ts */
import data from "data.ts";

export default defineConfig({
  plugins: [
  /* ----- */
  vitePug({
    data: data
  })
  /* ----- */
  ]
});
```

**input**
```pug
html
  head
    title #{meta.title}
  body
    div
      h1 #{hoge}
      p #{bar}
```
**output**

```html
<html>
  <head>
    <title>vite x pug</title>
  </head>
  <body>
    <div>
      <h1>fuga</h1>
      <p>foo</p>
    </div>
  </body>
</html>
```