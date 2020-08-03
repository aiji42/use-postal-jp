import { useFetch } from 'react-hooks-async'

const API_ENDPOINT = 'https://madefor.github.io/postal-code-api/api/v1/'

const url = (postalCode) => `${API_ENDPOINT}${postalCode.slice(0, 3)}/${postalCode.slice(3, 7)}.json`

export const usePostalJp = (code) => {
  return useFetch(url(code))
}
