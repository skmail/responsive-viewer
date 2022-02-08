import Tool from './tool'
import Konva from 'konva'
import { applyStrokeDashArray } from '../utils/stroke'

export default class Circle extends Tool {
  startX = 0
  startY = 0
  update = null

  constructor({ x, y, latestStyles }, stage) {
    super(stage)
    this.startX = x
    this.startY = y
    const strokeWidth = latestStyles.strokeWidth || 2

    this.instance = new Konva.Circle({
      stroke: latestStyles.stroke || 'red',
      fill: latestStyles.fill,
      strokeWidth,
      dash: applyStrokeDashArray(latestStyles.dash, strokeWidth),
      lineCap: 'round',
      lineJoin: 'round',
    })
    this.layer.add(this.instance)
  }

  move({ x, y }) {
    const radius = Math.sqrt(
      Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2)
    )

    this.instance.radius(radius)
    this.instance.x(this.startX)
    this.instance.y(this.startY)
  }

  finished() {
    this.instance.destroy()
    return this.createDataElement({
      type: 'circle',
      x: this.instance.x(),
      y: this.instance.y(),
      radius: this.instance.radius(),
      fill: this.instance.fill(),
      stroke: this.instance.stroke(),
      strokeWidth: this.instance.strokeWidth(),
      dash: this.instance.dash(),
    })
  }
}
