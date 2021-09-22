import endpoint from './endpoint'
import { useState, useEffect } from 'react'

const sanitize = (code: string | number) =>
  `${code}`
    .replace(/[^0-9０-９]/g, '')
    .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
    .slice(0, 7)

const url = (postalCode: string) =>
  `${endpoint.api}${postalCode.slice(0, 3)}/${postalCode.slice(3, 7)}.json`

type APIResponse = {
  code: string
  data: Array<{
    prefcode: string
    ja: {
      prefecture: string
      address1: string
      address2: string
      address3: string
      address4: string
    }
  }>
}

const parseResponse = (res: APIResponse): Address => {
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

type Address = {
  prefectureCode: string
  prefecture: string
  address1: string
  address2: string
  address3: string
  address4: string
}

type UsePostalJpResultAddress = Address | null

type LoadingState = boolean

type UsePostalJp = (
  postalCode: string,
  ready?: boolean
) => [UsePostalJpResultAddress, LoadingState, Error | null]

export const usePostalJp: UsePostalJp = (postalCode, ready = true) => {
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [address, setAddress] = useState<UsePostalJpResultAddress>(null)

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
