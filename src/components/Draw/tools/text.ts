import Tool from './tool'
import { Element } from '../../../types/draw'
import Konva from 'konva'

export default class Text extends Tool {
  startX = 0
  startY = 0
  width = 0
  height = 0
  fill = 'red'
  constructor(
    {
      x,
      y,
      latestStyles,
    }: { x: number; y: number; latestStyles: Partial<Element> },
    stage: Konva.Stage
  ) {
    super(stage)
    this.startX = x
    this.startY = y
    this.fill = latestStyles.fill || 'red'
  }

  finished() {
    return this.createDataElement({
      type: 'text',
      x: this.startX,
      y: this.startY,
      width: 200,
      fill: this.fill,
      text: 'Place text here',
    })
  }
}
