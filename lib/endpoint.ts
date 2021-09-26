export default {
  api: 'https://madefor.github.io/postal-code-api/api/v1/'
}

export type APIResponse = {
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
