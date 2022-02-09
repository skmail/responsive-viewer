import React, {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  useRef,
  useState,
} from 'react'
import { makeStyles, darken, alpha } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye'
import RemoveRedEyeOutlinedIcon from '@material-ui/icons/RemoveRedEyeOutlined'
import Box from '@material-ui/core/Box'

import Heading from './Heading'
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
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import Scrollbars from '../Scrollbars'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import {
  selectScreens,
  selectSelectedTab,
  selectTab,
  sortScreens,
  toggleTabScreen,
} from '../../reducers/app'
import { useAppSelector } from '../../hooks/useAppSelector'
import { Device } from '../../types'
import { scrollToScreen, toggleScreenDialog } from '../../reducers/layout'
import { useAppDispatch } from '../../hooks/useAppDispatch'

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
      margin: theme.spacing(0.5),
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
      screen,
      sortIndex,
      classes,
      disableSort = false,
      tab,
      ...rest
    }: {
      screen: Device
      sortIndex: number
      classes: any
      disableSort: boolean
      tab: string
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const dispatch = useAppDispatch()

    return (
      <div
        onDoubleClick={() => dispatch(toggleScreenDialog(screen))}
        onClick={() => dispatch(scrollToScreen(screen.id))}
        className={classes.screenRow}
        ref={ref}
        {...rest}
      >
        <IconButton
          color="primary"
          className={classes.visibleButton}
          onClick={() =>
            dispatch(
              toggleTabScreen({
                tabId: tab,
                screenId: screen.id,
              })
            )
          }
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
      </div>
    )
  }
)
const SortableItem = (props: any) => {
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

export default () => {
  const rootRef = useRef<HTMLDivElement>(null)

  const selectedTab = useSelector(selectSelectedTab)

  const [searchKeyword, setSearchKeyword] = useState('')

  const dispatch = useDispatch()

  const hasSearch = searchKeyword.trim() !== ''

  const { visibleScreens, invisibleScreens, searchResults } = useAppSelector(
    state => {
      let screens = selectScreens(state)

      const tab = selectTab(state, selectedTab)

      let visibleScreens: Device[] = []
      let invisibleScreens: Device[] = []
      let searchResults: Device[] = []

      if (!tab) {
        return {
          visibleScreens,
          invisibleScreens,
          searchResults,
        }
      }

      const result = screens.reduce(
        (acc, screen) => {
          if (tab.screens.includes(screen.id)) {
            acc.visibleScreens.set(screen.id, {
              ...screen,
              visible: true,
            })
          } else {
            acc.invisibleScreens.push(screen)
          }
          return acc
        },
        {
          visibleScreens: new Map<string, Device>(),
          invisibleScreens: [] as Device[],
        }
      )

      visibleScreens = tab.screens.map(id =>
        result.visibleScreens.get(id)
      ) as Device[]

      invisibleScreens = result.invisibleScreens

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

  const onSortEnd = ({ active, over }: DragEndEvent) => {
    if (!over) {
      return
    }

    const oldIndex = visibleScreens.findIndex(screen => screen.id === active.id)
    const newIndex = visibleScreens.findIndex(screen => screen.id === over.id)

    dispatch(
      sortScreens({
        tab: selectedTab,
        from: oldIndex,
        to: newIndex,
      })
    )
  }

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchKeyword(e.target.value)

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
                  screen={screen}
                  disableSort={true}
                  classes={classes}
                  tab={selectedTab}
                  sortIndex={0}
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
                      sortIndex={index}
                      classes={classes}
                      screen={screen}
                      tab={selectedTab}
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
                  tab={selectedTab}
                  classes={classes}
                  screen={screen}
                  sortIndex={0}
                  disableSort={true}
                />
              ))}
            </Box>
          )}
        </div>
      </Scrollbars>
    </React.Fragment>
  )
}
