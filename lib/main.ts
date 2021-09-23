import { useState, useEffect } from 'react'
import {
  Address,
  ParseResponse,
  postalHandler,
  sanitize,
  parseResponse as _parseResponse
} from './utils'
export { postalHandler } from './utils'

export const usePostalJp = <T extends Record<string, unknown> = Address, R>(
  postalCode: string,
  ready = true,
  option?: {
    makeRequestURL?: (code: [string, string]) => string
    parseResponse?: ParseResponse<T, R>
  }
): [T | null, boolean, Error | null] => {
  const makeRequestURL = option?.makeRequestURL ?? postalHandler.makeRequestURL
  const parseResponse: ParseResponse<T, R> =
    option?.parseResponse ?? _parseResponse
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [address, setAddress] = useState<T | null>(null)

  useEffect(() => {
    let mounted = true
    if (!ready) return
    setLoading(true)
    fetch(makeRequestURL(sanitize(postalCode)))
      .then((res) => {
        if (!res.ok) throw new Error('Bad request')
        return res.json()
      })
      .then((data) => {
        mounted && setAddress(parseResponse(data))
        mounted && setError(null)
      })
      .catch((e) => {
        mounted && setAddress(null)
        mounted && setError(e)
      })
      .finally(() => {
        mounted && setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [postalCode, ready])

  return [address, loading, error]
}
