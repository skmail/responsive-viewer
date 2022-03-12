import Tool from './tool'
import Konva from 'konva'
import { applyStrokeDashArray } from '../utils/stroke'
import { Element } from '../../../types/draw'

export default class Rect extends Tool {
  startX = 0
  startY = 0
  width = 0
  height = 0
  instance: Konva.Rect

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
    const strokeWidth = latestStyles.strokeWidth || 2

    this.instance = new Konva.Rect({
      stroke: latestStyles.stroke || 'red',
      fill: latestStyles.fill,
      strokeWidth,
      dash: applyStrokeDashArray(latestStyles.dash, strokeWidth),
      lineCap: 'round',
      lineJoin: 'round',
    })
    this.layer.add(this.instance)
  }

  move({ x, y }: { x: number; y: number }) {
    this.instance.x(x < this.startX ? x : this.startX)
    this.instance.y(y < this.startY ? y : this.startY)
    this.instance.width(x < this.startX ? this.startX - x : x - this.startX)
    this.instance.height(y < this.startY ? this.startY - y : y - this.startY)
  }

  finished() {
    this.instance.destroy()

    return this.createDataElement({
      type: 'rect',
      x: this.instance.x(),
      y: this.instance.y(),
      width: this.instance.width(),
      height: this.instance.height(),

      fill: this.instance.fill(),
      stroke: this.instance.stroke(),
      strokeWidth: this.instance.strokeWidth(),
      dash: this.instance.dash(),
    })
  }
}
