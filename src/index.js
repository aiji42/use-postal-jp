import endpoint from './endpoint'
import { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'

const sanitize = (code) => code.replace(/[^0-9０-９]/g, '').replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).slice(0, 7)

const url = (postalCode) => `${endpoint.api}${postalCode.slice(0, 3)}/${postalCode.slice(3, 7)}.json`

export const usePostalJp = () => {
  const [postalCode, setPostalCode] = useState('')
  const [sanitizedCode, setSanitizedCode] = useState('')
  const [error, setError] = useState(null)
  const [pending, setPending] = useState(false)
  const [response, setResponse] = useState(null)
  const [address, setAddress] = useState({})
  const resetState = useCallback(() => {
    setError(null)
    setPending(false)
    setResponse(null)
    setAddress({})
  }, [])
  const mounted = useRef(true)

  const getAddress = useCallback(async (code) => {
    try {
      resetState()
      if (code.length < 7) throw new Error('Incorrect postcode.')
      const res = await axios.get(url(code))
      const { data: { data: [{ prefcode: prefectureCode, ja }] } } = res
      setAddress({ prefectureCode, ...ja })
      setResponse(res)
    } catch (e) {
      setError(e)
    }
    setPending(false)
  }, [setAddress, setResponse, setError, resetState])

  useEffect(() => {
    if (mounted.current) {
      mounted.current = false
      return
    }
    const code = sanitize(postalCode)
    setSanitizedCode(code)
    getAddress(code)
  }, [postalCode, getAddress])

  return { response, address, error, pending, sanitizedCode, setPostalCode }
}
