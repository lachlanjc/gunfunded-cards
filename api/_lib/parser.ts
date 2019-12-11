import { IncomingMessage } from 'http'
import { parse } from 'url'
import { ParsedRequest } from './types'

export function parseRequest(req: IncomingMessage): ParsedRequest {
  console.log('HTTP ' + req.url)
  const { pathname = '/', query = {} } = parse(req.url || '', true)
  const { variant, caption } = query

  const empty: ParsedRequest = {
    fileType: 'png',
    id: 'PA-15',
    variant: 'card',
    caption: ''
  }
  if (!pathname) return empty

  const arr = pathname.slice(1).split('.')
  let extension = ''
  let text = ''
  if (arr.length === 0) {
    text = ''
  } else if (arr.length === 1) {
    text = arr[0]
  } else {
    extension = arr.pop() as string
    text = arr.join('.')
  }

  const parsedRequest: ParsedRequest = {
    fileType: extension === 'jpeg' ? extension : 'png',
    id: decodeURIComponent(text),
    variant: variant === 'story' ? 'story' : 'card',
    caption: decodeURIComponent(caption as string)
  }
  return parsedRequest
}
