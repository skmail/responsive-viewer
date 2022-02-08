import React, { useState, useRef, useEffect, useCallback } from 'react'
import DialogToolbar from '@material-ui/core/Toolbar'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'
import Canvas from './Canvas'
import Toolbar from './Toolbar'

const useStyles = makeStyles(theme => ({
  header: {
    position: 'relative',
  },
  content: {
    padding: theme.spacing(2),
    height: 100,

    overflow: 'hidden',
  },
  canvas: {
    height: '100%',
    position: 'relative',
  },
}))

const DialogWrapper = ({
  activeTool,
  addElement,
  elements,
  onSelect,
  selected,
  latestStyles,
  onElementUpdate,
  onElementRemove,
}) => {
  const classes = useStyles()

  const canvasRef = useRef()

  const [canvasSize, setCanvasSize] = useState(null)

  useEffect(() => {
    const updateSize = () => {
      const rootBox = canvasRef.current.getBoundingClientRect()
      setCanvasSize({
        width: rootBox.width,
        height: rootBox.height,
      })
    }

    updateSize()

    window.addEventListener('resize', updateSize)

    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return (
    <div ref={canvasRef} className={classes.canvas}>
      {!!canvasSize && (
        <Canvas
          addElement={addElement}
          elements={elements}
          activeTool={activeTool}
          width={canvasSize.width}
          height={canvasSize.height}
          onSelect={onSelect}
          selected={selected}
          latestStyles={latestStyles}
          onElementUpdate={onElementUpdate}
          onElementRemove={onElementRemove}
        />
      )}
      <div id="canvas-dom-wrapper" />
    </div>
  )
}

const DrawDialog = props => {
  const handleClose = () => {}
  const classes = useStyles()
  const id = 'draw'
  const [activeTool, setActiveTool] = useState(null)
  const [selected, onSelect] = useState()
  const [elements, setElements] = useState([
    {
      id: 1,
      type: 'image',
      src: '/test.jpeg',
      width: 1000,
      height: 1000,
      x: 0,
      y: 0,
      draggable: false,
      locked: true,
    },
  ])

  const latestStyles = useRef({})

  const addElement = element => {
    setElements(elements => [...elements, element])
    setActiveTool(null)
    onSelect(element.id)
  }
  const selectedElement = selected
    ? elements.find(element => element.id === selected)
    : null

  const onElementUpdate = (id, data) => {
    latestStyles.current = {
      ...latestStyles.current,
      ...data,
    }

    setElements(elements =>
      elements.map(element => {
        if (element.id === id) {
          return {
            ...element,
            ...data,
          }
        }
        return element
      })
    )
  }

  const onElementRemove = useCallback(id => {
    onSelect(selected => (selected === id ? undefined : selected))
    setElements(elements => elements.filter(element => element.id !== id))
  }, [])

  return (
    <Dialog fullScreen id={id} open={true} onClose={handleClose}>
      <AppBar className={classes.header}>
        <DialogToolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Edit screenshots
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            Download
          </Button>
        </DialogToolbar>
      </AppBar>
      <DialogContent className={classes.content}>
        <DialogWrapper
          addElement={addElement}
          elements={elements}
          activeTool={activeTool}
          onSelect={onSelect}
          selected={selected}
          selectedElement={selectedElement}
          latestStyles={latestStyles}
          onElementUpdate={onElementUpdate}
          onElementRemove={onElementRemove}
        />
        <Toolbar
          setActiveTool={setActiveTool}
          activeTool={activeTool}
          selectedElement={selectedElement}
          onElementUpdate={onElementUpdate}
        />
      </DialogContent>
    </Dialog>
  )
}

export default DrawDialog
