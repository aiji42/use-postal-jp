import React, { useState, VFC } from 'react'
import './App.css'
import { usePostalJp } from '../lib/main'

const App: VFC = () => {
  const [value, setValue] = useState('')
  const [address, loading, error] = usePostalJp(value, value.length >= 7)

  return (
    <div className="App">
      <main>
        <div className="address">
          <input
            type="text"
            onChange={(e) => setValue(e.target.value)}
            placeholder="input Japanese postal code"
          />
          <dl>
            <dt>Loading Status</dt>
            <dd>{loading ? 'now loading' : 'not loading'}</dd>
            <dt>Prefecture</dt>
            <dd>
              {address?.prefecture ?? '-'}
              {address?.prefectureCode ? ` (${address?.prefectureCode})` : ''}
            </dd>
            <dt>Address1 (city)</dt>
            <dd>{address?.address1 ?? '-'}</dd>
            <dt>Address2 (town)</dt>
            <dd>{address?.address2 ?? '-'}</dd>
            <dt>Address3</dt>
            <dd>{address?.address3 ?? '-'}</dd>
            <dt>Address4</dt>
            <dd>{address?.address4 ?? '-'}</dd>
            <dt>Error</dt>
            <dd>{error?.message ?? '-'}</dd>
          </dl>
        </div>
      </main>
    </div>
  )
}

export default App
