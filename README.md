# use-postal-jp

郵便番号を住所に変換するReactカスタムフックです。住所データを内部に持たず、APIで住所変換するため軽量なパッケージになっています。

[![NPM](https://img.shields.io/npm/v/use-postal-jp.svg)](https://www.npmjs.com/package/use-postal-jp) [![codecov](https://codecov.io/gh/aiji42/use-postal-jp/branch/master/graph/badge.svg?token=CODQMUB6KL)](https://codecov.io/gh/aiji42/use-postal-jp)

## Install

```bash
// npm
npm install --save use-postal-jp

// yarn
yarn add use-postal-jp
```

## DEMO

https://aiji42.github.io/use-postal-jp/

## Usage

```jsx
import React, { useEffect, useState } from 'react'
import { usePostalJp } from 'use-postal-jp'

const App = () => {
  const [value, setValue] = useState('')
  const [address, loading, error] = usePostalJp(value, value.length >= 7)

  return (
    <div>
      <input type='text' onChange={(e) => setValue(e.target.value)} placeholder='Plz input postal code!' />
      <p>sanitizedCode: {sanitizedCode}</p>
      {!loading &&
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

## usePostalJp

```ts
const [address, loading, error] = usePostalJp(postalCode, ready, { url, parse })
```

### Args
`usePostalJp(postalCode, ready, option)`


- __postalCode__: `string` (必須)
    - 郵便番号の文字列
    - ハイフンあり('100-0001')、全角('１００ー０００１') でもOK
- __ready__: `boolean` (必須) 
    - `true` をわたすと、APIリクエストが行われる
- __option__: `object` (任意) 
    - [madefor/postal-code-api](https://github.com/madefor/postal-code-api) 以外の独自のエンドポイントを使用する場合に使用
    - 詳細は後述 ([カスタムエンドポイントを使用する場合](#カスタムエンドポイントを使用する場合))

### Returns
`const [address, loading, error] = usePostalJp(...)`
- __address:__ `Address | null`
```ts
type Adress = {
  prefectureCode: string; // 都道府県コード
  prefecture: string; // 都道府県
  address1: string; // 市区町村
  address2: string; // 市区町村配下
  address3: stging; // 更に詳細情報
  address4: string; // 建物名など
}
```
- __loading:__ `boolean`
    - API通信中は `true` になる
- __error:__ `Error | null`
    - 郵便番号の桁不足や、存在しない郵便番号でAPIが叩かれるなどしたときに、エラーオブジェクトが返却される
    - 正常であれば `null`

### カスタムエンドポイントを使用する場合

```ts
// エンドポイントを作成する関数: 前方3桁、後方4桁の半角郵便番号数字が配列で引数に渡される
const url = ([code1, code2]: [string, string]) => `https://your.api.com/api?postal_code=${code1}-${code1}`
// エンドポイントからのレスポンスをパースする関数: 返り値が直接 address となる
const parse = (res: YourResBodyObject) => ({
  prefecture: res[0].prefecture_name,
  city: res[0].city_name,
  town: res[0].town_name
})

// address: { prefecture: string; city: string; town: string } | null
const [address, loading, error] = usePostalJp(postalCode, ready, { url, parse })
```

## 住所検索API

本プロジェクトでは [madefor/postal-code-api](https://github.com/madefor/postal-code-api) の住所検索APIを使用させていただいております。
オーナー様及びコントリビューターの方々に感謝申し上げます。

## License

MIT © [aiji42](https://github.com/aiji42)
