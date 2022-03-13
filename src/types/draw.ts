type BaseElement = {
  id: string
  draggable?: boolean
  locked?: boolean
  stroke?: string
  strokeWidth?: number
  fill?: string
  dash?: number[]
  lineJoin?: string
  lineCap?: string
}

type WithPosition = {
  x: number
  y: number
}

type WithSize = {
  width: number
  height: number
}

export interface ImageElement extends BaseElement, WithPosition, WithSize {
  type: 'image'
  src: string
}

export interface ArrowElement extends BaseElement {
  type: 'arrow'
  points: number[]
}

export interface CircleElement extends BaseElement, WithPosition {
  type: 'circle'
  radius: number
}
export interface EllipseElement extends BaseElement, WithPosition {
  type: 'ellipse'
  radiusX: number
  radiusY: number
}

export interface PenElement extends BaseElement {
  type: 'pen'
  points: number[]
}

export interface RectElement extends BaseElement, WithPosition, WithSize {
  type: 'rect'
}

export interface TextElement extends BaseElement, WithPosition, WithSize {
  type: 'text'
  text: string
}
export type Element =
  | ImageElement
  | ArrowElement
  | CircleElement
  | EllipseElement
  | PenElement
  | RectElement
  | TextElement

export type DrawingTool =
  | 'arrow'
  | 'circle'
  | 'ellipse'
  | 'pen'
  | 'rect'
  | 'text'

export type Color = {
  rgb: {
    r: number
    g: number
    b: number
    a: number
  }
}

export type Page = {
  elements: string[]
  id: string
  name: string
  width: number
  height: number
}
