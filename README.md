# use-postal-jp

> 郵便番号を住所に変換するReactカスタムフックです。住所データを内部に持たず、APIで住所変換するため非常な軽量なパッケージになっています。そのため、クライアントサイド向きです。

[![NPM](https://img.shields.io/npm/v/use-postal-jp.svg)](https://www.npmjs.com/package/use-postal-jp) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save use-postal-jp
```

## Usage

```jsx
import React, { Component } from 'react'

import { useMyHook } from 'use-postal-jp'

const Example = () => {
  const example = useMyHook()
  return (
    <div>{example}</div>
  )
}
```

## License

MIT © [aiji42](https://github.com/aiji42)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
