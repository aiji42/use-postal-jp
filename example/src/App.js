import React, { useEffect, useState } from 'react'
import { usePostalJp } from 'use-postal-jp'

const App = () => {
  const [value, setValue] = useState('')
  const { address, error, sanitizedCode, setPostalCode, response } = usePostalJp()
  useEffect(() => {
    setPostalCode(value)
  }, [value, setPostalCode])

  useEffect(() => {
    response && console.log(response)
  }, [response])

  return (
    <div>
      <input type='text' onChange={(e) => setValue(e.target.value)} placeholder='Plz input postal code!' />
      <p>sanitizedCode: {sanitizedCode}</p>
      <p>prefectureCode: {address.prefectureCode && address.prefectureCode}</p>
      <p>prefecture: {address.prefecture && address.prefecture}</p>
      <p>address1: {address.address1 && address.address1}</p>
      <p>address2: {address.address2 && address.address2}</p>
      <p>address3: {address.address3 && address.address3}</p>
      <p>address4: {address.address4 && address.address4}</p>
      <p>error: {error && error.message}</p>
    </div>
  )
}
export default App
