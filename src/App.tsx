import React, { useState } from 'react'
import './App.css'
import { usePostalJp } from '../lib/main'

function App() {
  const [value, setValue] = useState('')
  const [address, loading, error] = usePostalJp(value, value.length >= 7, {
    url: ([first, second]) =>
      `https://www.lifedot.jp/api/postal_codes?postal_code=${first}-${second}`,
    parse: (
      res: {
        prefecture_code: string
        prefecture_name: string
        city_name: string
        town_name: string
      }[]
    ) => ({
      prefectureCode: res[0].prefecture_code,
      prefecture: res[0].prefecture_name,
      address1: res[0].city_name,
      address2: res[0].town_name,
      address3: '',
      address4: ''
    })
  })

  return (
    <div className="App">
      <header className="App-header">
        <input
          type="text"
          onChange={(e) => setValue(e.target.value)}
          placeholder="Plz input postal code!"
        />
        <p>prefectureCode: {address?.prefectureCode}</p>
        <p>prefecture: {address?.prefecture}</p>
        <p>address1: {address?.address1}</p>
        <p>address2: {address?.address2}</p>
        <p>address3: {address?.address3}</p>
        <p>address4: {address?.address4}</p>
        <p>error: {error?.message}</p>
        <p>loading: {`${loading}`}</p>
      </header>
    </div>
  )
}

export default App
