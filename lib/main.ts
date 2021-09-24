import { useState, useEffect } from 'react'
import {
  Address,
  ParseResponse,
  makeRequestURL,
  parseResponse,
  sanitize
} from './utils'
import { APIResponse } from './endpoint'

type AddressOrCustom<T> = T extends never | Address ? Address : T

export const usePostalJp = <T = Address, R = APIResponse>(
  postalCode: string,
  ready: boolean,
  option?: {
    url?: (code: [string, string]) => string
    parse?: (res: R) => T
  }
): [AddressOrCustom<T> | null, boolean, Error | null] => {
  const url = option?.url ?? makeRequestURL
  const parse = <ParseResponse<AddressOrCustom<T>, R>>(
    (option?.parse ?? parseResponse)
  )
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [address, setAddress] = useState<AddressOrCustom<T> | null>(null)

  useEffect(() => {
    let mounted = true
    if (!ready) return
    setLoading(true)
    fetch(url(sanitize(postalCode)))
      .then((res) => {
        if (!res.ok) throw new Error('Bad request')
        return res.json()
      })
      .then((data) => {
        mounted && setAddress(parse(data))
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
