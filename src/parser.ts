import { IncomingMessage } from 'http'
import { parse } from 'url'

export function parseRequest(req: IncomingMessage) {
  const { pathname = '/', query = {} } = parse(req.url || '', true)
  console.log('HTTP', pathname, query)
  const { author, fontSize, images, theme, md } = query
  if (Array.isArray(fontSize)) {
    throw new Error('Expected a single fontSize')
  }
  if (Array.isArray(theme)) {
    throw new Error('Expected a single theme')
  }

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
    author: decodeURIComponent(author as string),
    text: decodeURIComponent(text),
    theme: theme === 'dark' ? 'dark' : 'light',
    md: md === '1' || md === 'true',
    fontSize: fontSize || '150px',
    images: Array.isArray(images) ? images : [images]
  }
  parsedRequest.images = getDefaultImages(parsedRequest.images)
  return parsedRequest
}

function getDefaultImages(images: string[]) {
  return images.length > 0 && images[0] ? images : []
}
