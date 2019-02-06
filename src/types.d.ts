type FileType = 'png' | 'jpeg'
type Theme = 'light' | 'dark'

interface ParsedRequest {
  fileType: FileType
  text: string
  author: string
  theme: Theme
  md: boolean
  fontSize: string
  images: string[]
}
