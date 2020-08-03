import React from 'react'
import { useMyHook } from 'use-postal-jp'

const App = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
export default App