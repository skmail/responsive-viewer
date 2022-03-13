import Tool from './tool'
import Konva from 'konva'
import { applyStrokeDashArray } from '../utils/stroke'
import { Element } from '../../../types/draw'

export default class Pen extends Tool {
  startX = 0
  startY = 0
  width = 0
  height = 0
  instance: Konva.Line
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
    this.instance = new Konva.Line({
      stroke: latestStyles.stroke || 'red',
      fill: latestStyles.stroke || 'red',
      strokeWidth,
      dash: applyStrokeDashArray(latestStyles.dash, strokeWidth),
      lineCap: 'round',
      lineJoin: 'round',
      points: [this.startX, this.startY],
    })
    this.layer.add(this.instance)
  }

  move({ x, y }: { x: number; y: number }) {
    this.instance.points(this.instance.points().concat([x, y]))
  }

  finished() {
    this.instance.destroy()
    return this.createDataElement({
      type: 'pen',
      points: this.instance.points(),
      fill: this.instance.stroke(),
      stroke: this.instance.stroke(),
      strokeWidth: this.instance.strokeWidth(),
      dash: this.instance.dash(),
    })
  }
}
