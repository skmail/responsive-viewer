import React, { forwardRef, useRef, useState } from 'react'
import { makeStyles, darken, alpha } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye'
import RemoveRedEyeOutlinedIcon from '@material-ui/icons/RemoveRedEyeOutlined'
import Box from '@material-ui/core/Box'

import Heading from './Heading'
import InputBase from '@material-ui/core/InputBase'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { moveTabScreen, toggleTabScreen } from '../../actions'
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
import Scrollbars from '../Scrollbars'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { getScreens, getTab, getSelectedTab } from '../../selectors'
import { updateVisibility as updateVisibilityAction } from '../../actions'

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
      color: alpha(theme.palette.secondary.dark, 0.6),
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

  const { sortScreens, onClick, toggleScreenDialog } = props

  const selectedTab = useSelector(getSelectedTab)

  const [searchKeyword, setSearchKeyword] = useState('')

  const dispatch = useDispatch()

  const hasSearch = searchKeyword.trim('') !== ''

  const { visibleScreens, invisibleScreens, searchResults } = useSelector(
    state => {
      let screens = getScreens(state)

      const tab = getTab(state, selectedTab)

      let visibleScreens = []
      let invisibleScreens = []

      if (tab.name === 'default') {
        const result = screens.reduce(
          (acc, screen) => {
            if (screen.visible) {
              acc.visibleScreens.push(screen)
            } else {
              acc.invisibleScreens.push(screen)
            }

            return acc
          },
          {
            visibleScreens: [],
            invisibleScreens: [],
          }
        )

        visibleScreens = result.visibleScreens
        invisibleScreens = result.invisibleScreens
      } else {
        const result = screens.reduce(
          (acc, screen) => {
            if (tab.screens.includes(screen.id)) {
              acc.visibleScreens.set(screen.id, {
                ...screen,
                visible: true,
              })
            } else {
              acc.invisibleScreens.push({
                ...screen,
                visible: false,
              })
            }
            return acc
          },
          {
            visibleScreens: new Map(),
            invisibleScreens: [],
          }
        )

        visibleScreens = tab.screens.map(id => result.visibleScreens.get(id))

        invisibleScreens = result.invisibleScreens
      }

      let searchResults = []

      screens = [...visibleScreens, ...invisibleScreens]

      if (hasSearch) {
        searchResults = screens.filter(screen => {
          const size = `${screen.width}${screen.height}`
          return (
            screen.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            size.includes(searchKeyword.toLowerCase())
          )
        })
      }

      return {
        visibleScreens,
        invisibleScreens,
        searchResults,
      }
    },
    shallowEqual
  )

  const classes = useStyles()

  const updateVisibility = (id, visibility) => {
    if (selectedTab === 'default') {
      dispatch(updateVisibilityAction(id, visibility))
    } else {
      dispatch(toggleTabScreen(selectedTab, id, visibility))
    }
  }

  const onSortEnd = ({ active, over }) => {
    const oldIndex = visibleScreens.findIndex(screen => screen.id === active.id)
    const newIndex = visibleScreens.findIndex(screen => screen.id === over.id)

    if (selectedTab === 'default') {
      sortScreens(arrayMove(visibleScreens, oldIndex, newIndex))
    } else {
      dispatch(moveTabScreen(selectedTab, oldIndex, newIndex))
    }
  }

  const onSearchChange = e => setSearchKeyword(e.target.value)

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
      <Scrollbars>
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
