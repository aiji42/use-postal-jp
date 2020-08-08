# use-postal-jp

> 郵便番号を住所に変換するReactカスタムフックです。住所データを内部に持たず、APIで住所変換するため軽量なパッケージになっています。そのため、クライアントサイド向きです。

[![NPM](https://img.shields.io/npm/v/use-postal-jp.svg)](https://www.npmjs.com/package/use-postal-jp) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Build Status](https://travis-ci.org/aiji42/use-postal-jp.svg?branch=master)](https://travis-ci.org/aiji42/use-postal-jp)

## Install

```bash
// npm
npm install --save use-postal-jp

// yarn
yarn add use-postal-jp
```

## Usage

```jsx
import React, { useEffect, useState } from 'react'
import { usePostalJp } from 'use-postal-jp'

const App = () => {
  const [value, setValue] = useState('')
  const { address, error, pending, sanitizedCode, setPostalCode } = usePostalJp()
  useEffect(() => {
    setPostalCode(value)
  }, [value, setPostalCode])

  return (
    <div>
      <input type='text' onChange={(e) => setValue(e.target.value)} placeholder='Plz input postal code!' />
      <p>sanitizedCode: {sanitizedCode}</p>
      {!pending &&
        <>
          <p>prefectureCode: {address.prefectureCode && address.prefectureCode}</p>
          <p>prefecture: {address.prefecture && address.prefecture}</p>
          <p>address1: {address.address1 && address.address1}</p>
          <p>address2: {address.address2 && address.address2}</p>
          <p>address3: {address.address3 && address.address3}</p>
          <p>address4: {address.address4 && address.address4}</p>
          <p>error: {error && error.message}</p>
        </>
      }
    </div>
  )
}
```

## API

```jsx
const { address, error, sanitizedCode, response, pending, setPostalCode } = usePostalJp()
const { prefectureCode, prefecture, address1, address2, address3, address4 } = address
```

- setPostalCode
    - `setPostalCode('1000001')` のように郵便番号を渡すと、APIにより住所変換がなされる
        - ハイフンあり('100-0001')、全角('１００ー０００１') でも変換可能
- pending
    - API通信中は `true` になる
- error
    - 郵便番号の桁不足や、存在しない郵便番号でAPIが叩かれるなどしたときに、エラーオブジェクトが返却される
    - 正常であれば `null`
- sanitizedCode
    - 全角=>半角、数字以外の文字を除いた郵便番号が返却される
        - ex. １００ー０００１ => 1000001
- address
    - 住所オブジェクト
    - prefectureCode: 都道府県コード
    - prefecture: 都道府県
    - address1: 市区町村
    - address2: 市区町村配下
    - address3: 更に詳細情報
    - address4: 建物名など
- response
    - 住所検索APIアクセスに対してのレスポンスオブジェクト
        - 住所のローマ字表記を使用する際にはこちらを参照してください

## 住所検索API

本プロジェクトでは [madefor/postal-code-api](https://github.com/madefor/postal-code-api) の住所検索APIを使用させていただいております。
オーナー様及びコントリビューターの方々に感謝申し上げます。

## License

MIT © [aiji42](https://github.com/aiji42)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
