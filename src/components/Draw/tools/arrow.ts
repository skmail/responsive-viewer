import Tool from './tool'
import Konva from 'konva'
import { applyStrokeDashArray } from '../utils/stroke'
import { Element } from '../../../types/draw'

export default class Circle extends Tool {
  startX = 0
  startY = 0
  tool: string
  instance: Konva.Arrow

  constructor(
    {
      x,
      y,
      tool,
      latestStyles,
    }: { x: number; y: number; tool: string; latestStyles: Partial<Element> },
    stage: Konva.Stage
  ) {
    super(stage)
    this.startX = x
    this.startY = y

    this.tool = tool

    const strokeWidth = latestStyles.strokeWidth || 2

    this.instance = new Konva.Arrow({
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
    x = x - 1
    y = y - 1
    if (this.tool === 'arrow-pen') {
      const points = this.instance.points()
      const lastX = points[points.length - 2]
      const lastY = points[points.length - 1]
      if (lastX !== x && lastY !== y) {
        this.instance.points(points.concat([x, y]))
      }
    } else {
      this.instance.points([this.startX, this.startY, x, y])
    }
  }

  finished() {
    this.instance.destroy()
    return this.createDataElement({
      type: 'arrow',
      points: this.instance.points(),
      fill: this.instance.stroke(),
      stroke: this.instance.stroke(),
      strokeWidth: this.instance.strokeWidth(),
      dash: this.instance.dash(),
    })
  }
}
