export type FileType = 'png' | 'jpeg'
export type Variant = 'card' | 'story'

export interface ParsedRequest {
  fileType: FileType
  id: string
  caption: string
  variant: Variant
}
