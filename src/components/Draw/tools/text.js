import Tool from './tool'

export default class Text extends Tool {
  startX = 0
  startY = 0
  width = 0
  height = 0
  instance = null
  fill = 'red'

  constructor({ x, y, latestStyles }, stage) {
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
