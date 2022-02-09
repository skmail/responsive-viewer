import React, {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  useRef,
  useState,
} from 'react'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Remove from '@mui/icons-material/Remove'
import Add from '@mui/icons-material/Add'
import Box from '@mui/material/Box'

import TextField from '@mui/material/TextField'
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
import { styled, darken } from '@mui/material/styles'

const ScreensList = styled('div')(({ theme }) => ({
  padding: theme.spacing(0.5),
}))
const SearchField = styled(TextField)(({ theme }) => ({
  background: darken(theme.palette.background.paper, 0.8),
  borderRadius: 5,
  border: 'none',
  '& .MuiInputBase-input': {
    fontSize: 12,
    padding: theme.spacing(0.5, 1),
    borderColor: 'transparent',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
  },
}))

const Heading = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 'bold',
  color: darken(theme.palette.text.secondary, 0.1),
  textTransform: 'uppercase',
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0, 1),
}))

const ScreenItem = styled('div')(({ theme }) => ({
  width: 60,
  height: 60,
  background: darken(theme.palette.background.paper, 0.8),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: theme.shape.borderRadius,
  lineHeight: 1,
  color: theme.palette.text.secondary,
  fontSize: 11,
  padding: theme.spacing(0.5),
  margin: theme.spacing(0.5),
  userSelect: 'none',
  '&:hover': {
    color: theme.palette.text.primary,
    cursor: 'pointer',
    boxShadow: ` 0 0 0 3px ${darken(theme.palette.text.primary, 0.8)}`,
    '& .MuiButtonBase-root': {
      opacity: 1,
      transform: 'scale(1)',
      zIndex: 15,
    },
  },

  position: 'relative',
}))

const ScreenSizeText = styled('div')(({ theme }) => ({
  color: darken(theme.palette.text.secondary, 0.2),
}))

const VisibilityButton = styled(IconButton)(({ theme }) => ({
  opacity: 0,
  transform: 'scale(0)',
  position: 'absolute',
  top: 0,
  right: 0,
  marginTop: theme.spacing(-1),
  marginRight: theme.spacing(-1),
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: 0,
  transition: 'all 0.1s ease',
  '&:hover': {
    transform: 'scale(1.2) !important',
    background: theme.palette.primary.main,
  },
}))

const Item = forwardRef(
  (
    {
      screen,
      sortIndex,
      disableSort = false,
      tab,
      ...rest
    }: {
      screen: Device
      sortIndex: number
      disableSort: boolean
      tab: string
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const dispatch = useAppDispatch()

    return (
      <ScreenItem
        onDoubleClick={() => dispatch(toggleScreenDialog(screen))}
        onClick={() => dispatch(scrollToScreen(screen.id))}
        ref={ref}
        {...rest}
      >
        <VisibilityButton
          color="primary"
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
          {!screen.visible && <Add fontSize="inherit" />}
          {screen.visible && <Remove fontSize="inherit" />}
        </VisibilityButton>

        <div>{screen.name}</div>
        <ScreenSizeText>
          {screen.width}x{screen.height}
        </ScreenSizeText>
      </ScreenItem>
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
    <>
      <Heading>Screens</Heading>
      <Box sx={{ paddingRight: 1, paddingLeft: 1 }}>
        <SearchField
          value={searchKeyword}
          onChange={onSearchChange}
          placeholder={'Search for screen'}
          fullWidth
          size="small"
        />
      </Box>

      <Scrollbars>
        <ScreensList ref={rootRef}>
          {hasSearch && (
            <Box display="flex" flexWrap="wrap">
              {searchResults.map(screen => (
                <Item
                  key={screen.id}
                  screen={screen}
                  disableSort={true}
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
                  screen={screen}
                  sortIndex={0}
                  disableSort={true}
                />
              ))}
            </Box>
          )}
        </ScreensList>
      </Scrollbars>
    </>
  )
}
