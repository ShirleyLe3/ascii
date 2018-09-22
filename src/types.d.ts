declare module '*.vert'
declare module '*.frag'

interface CanvasRenderingContext2D {
  filter: string
  imageSmoothingEnabled: boolean
  imageSmoothingQuality: 'low' | 'medium' | 'high'
}
