import endpoint from './endpoint'
import { useState, useEffect, useCallback, useRef } from 'react'

const sanitize = (code: string | number) => `${code}`.replace(/[^0-9０-９]/g, '').replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).slice(0, 7)

const url = (postalCode: string) => `${endpoint.api}${postalCode.slice(0, 3)}/${postalCode.slice(3, 7)}.json`

type Address = {
  prefectureCode?: string
  prefecture?: string
  address1?: string
  address2?: string
  address3?: string
  address4?: string
}

export const usePostalJp = () => {
  const [postalCode, setPostalCode] = useState<string|number>('')
  const [sanitizedCode, setSanitizedCode] = useState<string>('')
  const [error, setError] = useState<Error|null>(null)
  const [pending, setPending] = useState<boolean>(false)
  const [response, setResponse] = useState(null)
  const [address, setAddress] = useState<Address>({})
  const resetState = useCallback(() => {
    setError(null)
    setPending(false)
    setResponse(null)
    setAddress({})
  }, [])
  const mounted = useRef(true)

  const getAddress = useCallback(async (code: string) => {
    try {
      resetState()
      if (code.length < 7) throw new Error('Incorrect postcode.')
      setPending(true)
      const res = await fetch(url(code))
      const { data: { data: [{ prefcode: prefectureCode, ja }] } } = await res.json()
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
