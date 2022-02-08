import React, { useEffect, useState } from 'react'
import { Text as KonvaText } from 'react-konva'
import { useSelectionContext } from '../contexts/SelectionProvider'
import { useTransformerContext } from '../contexts/TransformerProvider'
import { useElement } from '../hooks/useElement'

const Text = ({ element, onChange }) => {
  const { ref, ...props } = useElement(element)
  const [isEditing, setIsEditing] = useState(false)
  const { selected } = useSelectionContext()
  const transformerRef = useTransformerContext()

  useEffect(() => {
    const textNode = ref.current

    textNode.on('dblclick dbltap', () => {
      setIsEditing(true)
    })

    setTimeout(() => {
      setIsEditing(true)
    }, 10)
  }, [])

  useEffect(() => {
    if (selected !== element.id) {
      return
    }
    const textNode = ref.current
    const oldAnchors = transformerRef.current.enabledAnchors()

    transformerRef.current.enabledAnchors(['middle-left', 'middle-right'])

    textNode.on('transform', function() {
      // reset scale, so only with is changing by transformer
      textNode.setAttrs({
        width: textNode.width() * textNode.scaleX(),
        scaleX: 1,
      })
    })

    return () => {
      if (transformerRef.current) {
        transformerRef.current.enabledAnchors(oldAnchors)
      }
      textNode.off('transform')
    }
  }, [element.id, selected])

  useEffect(() => {
    if (!isEditing) {
      return
    }
    const transformer = transformerRef.current
    const dom = document.getElementById('canvas-dom-wrapper')

    const overlay = document.createElement('div')

    overlay.style.position = 'absolute'
    overlay.style.inset = 0

    const textarea = document.createElement('textarea')

    dom.appendChild(overlay)
    dom.appendChild(textarea)
    const textNode = ref.current
    textNode.hide()
    transformer.hide()

    textarea.value = textNode.text()
    textarea.style.zIndex = 100
    textarea.style.position = 'absolute'
    textarea.style.top = textNode.y() + 'px'
    textarea.style.left = textNode.x() + 'px'
    textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px'
    textarea.style.height =
      textNode.height() - textNode.padding() * 2 + 5 + 'px'
    textarea.style.fontSize = textNode.fontSize() + 'px'
    textarea.style.border = 'none'
    textarea.style.padding = '0px'
    textarea.style.margin = '0px'
    textarea.style.overflow = 'hidden'
    textarea.style.background = 'none'
    textarea.style.outline = 'none'
    textarea.style.resize = 'none'
    textarea.style.lineHeight = textNode.lineHeight()
    textarea.style.fontFamily = textNode.fontFamily()
    textarea.style.transformOrigin = 'left top'
    textarea.style.textAlign = textNode.align()
    textarea.style.color = textNode.fill()
    let rotation = textNode.rotation()
    let transform = ''
    if (rotation) {
      transform += 'rotateZ(' + rotation + 'deg)'
    }

    let px = 0
    // also we need to slightly move textarea on firefox
    // because it jumps a bit
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
    if (isFirefox) {
      px += 2 + Math.round(textNode.fontSize() / 20)
    }
    transform += 'translateY(-' + px + 'px)'

    textarea.style.transform = transform

    // reset height
    textarea.style.height = 'auto'
    // after browsers resized it we can set actual value
    textarea.style.height = textarea.scrollHeight + 3 + 'px'

    textarea.focus()

    function setTextareaWidth(newWidth) {
      if (!newWidth) {
        // set width for placeholder
        newWidth = textNode.placeholder.length * textNode.fontSize()
      }
      // some extra fixes on different browsers
      var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
      var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      if (isSafari || isFirefox) {
        newWidth = Math.ceil(newWidth)
      }

      var isEdge = document.documentMode || /Edge/.test(navigator.userAgent)
      if (isEdge) {
        newWidth += 1
      }
      textarea.style.width = newWidth + 'px'
    }

    textarea.addEventListener('keydown', function(e) {
      const scale = textNode.getAbsoluteScale().x
      setTextareaWidth(textNode.width() * scale)
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + textNode.fontSize() + 'px'
    })

    const close = () => {
      setIsEditing(false)
    }

    textarea.addEventListener('click', e => e.stopPropagation())
    overlay.addEventListener('click', () => {
      onChange({
        text: textarea.value,
      })
      close()
    })

    textarea.addEventListener('keydown', function(e) {
      // on esc do not set value back to node
      if (e.code === 'Escape') {
        close()
      }
    })

    window.removeEventListener('click', close)
    return () => {
      overlay.parentNode.removeChild(overlay)
      textarea.parentNode.removeChild(textarea)
      window.removeEventListener('click', close)
      textNode.show()
      transformer.show()
      transformer.forceUpdate()
    }
  }, [isEditing, ref])

  return (
    <>
      <KonvaText
        {...props}
        ref={ref}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        text={element.text}
        fontSize={20}
        shadowBlur={10}
        fill={element.fill}
      />
    </>
  )
}

export default Text
