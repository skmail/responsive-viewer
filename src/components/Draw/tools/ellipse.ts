import Tool from './tool'
import Konva from 'konva'
import { applyStrokeDashArray } from '../utils/stroke'
import { Element } from '../../../types/draw'

export default class Ellipse extends Tool {
  startX = 0
  startY = 0
  instance: Konva.Ellipse
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

    this.instance = new Konva.Ellipse({
      stroke: latestStyles.stroke || 'red',
      fill: latestStyles.fill,
      strokeWidth,
      dash: applyStrokeDashArray(latestStyles.dash, strokeWidth),
      lineCap: 'round',
      lineJoin: 'round',
      radiusX: this.startX,
      radiusY: this.startY,
    })
    this.layer.add(this.instance)
  }

  move({ x, y }: { x: number; y: number }) {
    const [radiusX, drawX] = this.drawPoint(x, this.startX)
    const [radiusY, drawY] = this.drawPoint(y, this.startY)

    this.instance.x(drawX + radiusX)
    this.instance.y(drawY + radiusY)
    this.instance.radiusX(radiusX)
    this.instance.radiusY(radiusY)
  }

  drawPoint(point1: number, point2: number) {
    if (point1 < point2) {
      return [(point2 - point1) * 0.5, point1]
    } else {
      return [(point1 - point2) * 0.5, point2]
    }
  }

  finished() {
    this.instance.destroy()
    return this.createDataElement({
      type: 'ellipse',
      x: this.instance.x(),
      y: this.instance.y(),
      radiusX: this.instance.radiusX(),
      radiusY: this.instance.radiusY(),

      fill: this.instance.fill(),
      stroke: this.instance.stroke(),
      strokeWidth: this.instance.strokeWidth(),
      dash: this.instance.dash(),
    })
  }
}
