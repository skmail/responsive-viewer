import appendQuery from 'append-query'
import uuid from 'uuid'

export const getDomId = id => `screen-${id}`
export const getIframeId = id => `screen-iframe-${id}`

export const generateVersionedUrl = url =>
    appendQuery(url, { __url_version__: uuid.v4() })
