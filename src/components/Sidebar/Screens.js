import React, { forwardRef, useRef, useState } from 'react'
import { makeStyles, darken, fade } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye'
import RemoveRedEyeOutlinedIcon from '@material-ui/icons/RemoveRedEyeOutlined'
import Box from '@material-ui/core/Box'

import Heading from './Heading'
import { Scrollbars } from 'react-custom-scrollbars'
import InputBase from '@material-ui/core/InputBase'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'

const useStyles = makeStyles(theme => {
  return {
    screensRoot: {
      height: 200,
    },
    text: {
      lineHeight: 1,
    },

    visibilityIconInactive: {
      opacity: 0.5,
    },
    screenRow: {
      width: 60,
      height: 60,
      background: theme.palette.grey['900'],
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      borderRadius: theme.shape.borderRadius,
      lineHeight: 1,
      padding: theme.spacing(0.5),
      color: theme.palette.secondary.main,
      '&:hover': {
        color: theme.palette.primary.main,
        cursor: 'pointer',
        '& $visibleButton': {
          opacity: 1,
        },
      },

      position: 'relative',
    },
    screenSize: {
      fontSize: 11,
      marginTop: theme.spacing(0.6),
    },
    screenRowActions: {
      marginRight: theme.spacing(1),
    },
    screenName: {
      width: 40,
      height: 40,
      fontSize: 12,
      overflow: 'hidden',
    },
    searchInput: {
      height: 25,
      fontSize: 13,
      margin: theme.spacing(1, 0),
      padding: theme.spacing(0, 1),
      borderRadius: 3,
      background: darken(theme.palette.background.default, 0.15),
      color: fade(theme.palette.secondary.dark, 0.6),
    },
    visibleButton: {
      opacity: 0,
      position: 'absolute',
      top: 0,
      right: 0,
      marginTop: theme.spacing(-1),
      marginRight: theme.spacing(-1),
    },
  }
})

const Item = forwardRef(
  (
    {
      value: screen,
      sortIndex,
      updateVisibility,
      classes,
      onClick,
      disableSort = false,
      toggleScreenDialog,
      ...rest
    },
    ref
  ) => (
    <Box
      m={0.5}
      onDoubleClick={() => toggleScreenDialog(screen)}
      onClick={() => onClick(screen.id)}
      display="flex"
      alignItems="center"
      className={classes.screenRow}
      ref={ref}
      {...rest}
    >
      <IconButton
        color="primary"
        className={classes.visibleButton}
        onClick={() => updateVisibility(screen.id, !screen.visible)}
        size="small"
      >
        {!screen.visible && (
          <RemoveRedEyeOutlinedIcon
            className={classes.visibilityIconInactive}
            fontSize="inherit"
          />
        )}
        {screen.visible && <RemoveRedEyeIcon fontSize="inherit" />}
      </IconButton>

      <div className={classes.screenName}>{screen.name}</div>
      <div className={classes.screenSize}>
        {screen.width}x{screen.height}
      </div>
    </Box>
  )
)
const SortableItem = props => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Item
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      {...props}
    />
  )
}

export default props => {
  const rootRef = useRef()

  const {
    updateVisibility,
    screens,
    sortScreens,
    onClick,
    toggleScreenDialog,
  } = props

  const classes = useStyles()

  const [searchKeyword, setSearchKeyword] = useState('')

  const visibleScreens = screens.filter(screen => screen.visible)
  const invisibleScreens = screens.filter(screen => !screen.visible)

  const onSortEnd = ({ active, over }) => {
    const oldIndex = visibleScreens.findIndex(screen => screen.id === active.id)
    const newIndex = visibleScreens.findIndex(screen => screen.id === over.id)

    sortScreens(arrayMove(visibleScreens, oldIndex, newIndex))
  }

  const hasSearch = searchKeyword.trim('') !== ''

  const onSearchChange = e => setSearchKeyword(e.target.value)

  const searchResults = screens.filter(screen => {
    const size = `${screen.width}${screen.height}`
    return (
      screen.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      size.includes(searchKeyword.toLowerCase())
    )
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <React.Fragment>
      <Heading>Screens</Heading>
      <InputBase
        value={searchKeyword}
        onChange={onSearchChange}
        className={classes.searchInput}
        placeholder={'Search for screen'}
        fullWidth
      />
      <Scrollbars style={{ height: 350 }}>
        <div ref={rootRef} className={classes.screensRoot}>
          {hasSearch && (
            <Box display="flex" flexWrap="wrap">
              {searchResults.map(screen => (
                <Item
                  key={screen.id}
                  disableSort={true}
                  onClick={onClick}
                  classes={classes}
                  updateVisibility={updateVisibility}
                  toggleScreenDialog={toggleScreenDialog}
                  value={screen}
                />
              ))}
            </Box>
          )}

          {!hasSearch && (
            <DndContext
              sensors={sensors}
              onDragEnd={onSortEnd}
              collisionDetection={closestCenter}
            >
              <SortableContext
                items={visibleScreens}
                strategy={rectSortingStrategy}
              >
                <Box display="flex" flexWrap="wrap">
                  {visibleScreens.map((screen, index) => (
                    <SortableItem
                      key={screen.id}
                      id={screen.id}
                      index={index}
                      onClick={onClick}
                      classes={classes}
                      updateVisibility={updateVisibility}
                      toggleScreenDialog={toggleScreenDialog}
                      value={screen}
                    />
                  ))}
                </Box>
              </SortableContext>
            </DndContext>
          )}

          {!hasSearch && !!invisibleScreens.length && (
            <Box mb="1">
              <Heading>Disabled screens</Heading>
            </Box>
          )}
          {!hasSearch && (
            <Box display="flex" flexWrap="wrap">
              {invisibleScreens.map(screen => (
                <Item
                  key={screen.id}
                  onClick={onClick}
                  classes={classes}
                  updateVisibility={updateVisibility}
                  toggleScreenDialog={toggleScreenDialog}
                  value={screen}
                />
              ))}
            </Box>
          )}
        </div>
      </Scrollbars>
    </React.Fragment>
  )
}
