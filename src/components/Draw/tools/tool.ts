import Konva from 'konva'
import uuid from 'uuid'

export default class Tool {
  stage: Konva.Stage
  layer: Konva.Layer
  constructor(stage: Konva.Stage) {
    this.stage = stage
    this.layer = stage.getLayers()[0]
  }
  move(data: any) {}
  finished() {}

  createDataElement(data = {}) {
    return {
      id: uuid.v4(),
      ...data,
    }
  }
}
