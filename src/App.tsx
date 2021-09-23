import React, { useState } from 'react'
import './App.css'
import { usePostalJp, postalHandler } from '../lib/main'

postalHandler.makeRequestURL = ([first, second]) =>
  `https://www.lifedot.jp/api/postal_codes?postal_code=${first}-${second}`

postalHandler.parseResponse = (res) => ({
  prefectureCode: res[0].prefecture_code,
  prefecture: res[0].prefecture_name,
  address1: res[0].city_name,
  address2: res[0].town_name,
  address3: '',
  address4: ''
})

function App() {
  const [value, setValue] = useState('')
  const [address, loading, error] = usePostalJp(value, value.length >= 7)

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
