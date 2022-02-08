import uuid from 'uuid'

export default class Tool {
  stage = null
  layer = null
  constructor(stage) {
    this.stage = stage
    this.layer = stage.getLayers()[0]
  }
  move() {}
  finished() {}

  createDataElement(data = {}) {
    return {
      id: uuid.v4(),
      ...data,
    }
  }
}
