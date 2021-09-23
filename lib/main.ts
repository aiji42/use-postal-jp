import { useState, useEffect } from 'react'
import {
  Address,
  ParseResponse,
  postalHandler,
  sanitize,
  parseResponse as _parseResponse
} from './utils'
import { APIResponse } from './endpoint'
export { postalHandler } from './utils'

const a = (res: APIResponse): Address => {
  const {
    data: [{ prefcode, ja: data }]
  } = res
  return {
    prefectureCode: prefcode,
    prefecture: data.prefecture,
    address1: data.address1,
    address2: data.address2,
    address3: data.address3,
    address4: data.address4
  }
}

type AddressOrCustom<T> = T extends never | Address ? Address : T

export const usePostalJp = <T = Address, R = APIResponse>(
  postalCode: string,
  ready = true,
  option?: {
    makeRequestURL?: (code: [string, string]) => string
    parseResponse?: (res: R) => T
  }
): [AddressOrCustom<T> | null, boolean, Error | null] => {
  const makeRequestURL = option?.makeRequestURL ?? postalHandler.makeRequestURL
  const parseResponse = <ParseResponse<AddressOrCustom<T>, R>>(
    (option?.parseResponse ?? _parseResponse)
  )
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [address, setAddress] = useState<AddressOrCustom<T> | null>(null)

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
