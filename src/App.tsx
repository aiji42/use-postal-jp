import React, { useState } from 'react'
import './App.css'
import { usePostalJp } from '../lib/main'

function App() {
  const [value, setValue] = useState('')
  const [address, , error] = usePostalJp(value, value.length === 7)

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
      </header>
    </div>
  )
}

export default App
