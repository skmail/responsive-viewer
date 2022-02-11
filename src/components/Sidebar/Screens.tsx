import React, {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  useRef,
  useState,
  MouseEvent,
  useEffect,
} from 'react'

import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'
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

const ScreensPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPaper-root': {
    height: 400,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
    width: 300,
    [theme.breakpoints.down('sm')]: {
      width: 230,
    },
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

function ScreensView() {
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
      <Heading>Active Screens</Heading>
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
              <Heading>Inactive Screens</Heading>
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

export default function Screens({ view }: { view: 'list' | 'popover' }) {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  const onClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget as HTMLDivElement)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'screens-popover' : undefined
  const screens = <ScreensView />

  useEffect(() => {
    setAnchorEl(null)
  }, [view])

  return (
    <>
      {view === 'list' && screens}
      {view === 'popover' && (
        <Box display="flex" justifyContent="center">
          <Tooltip arrow placement="right" title="Screens">
            <IconButton aria-describedby={id} onClick={onClick}>
              <svg
                width={20}
                height={20}
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2.87868 2.87868C3.44129 2.31607 4.20435 2 5 2H19C19.7957 2 20.5587 2.31607 21.1213 2.87868C21.6839 3.44129 22 4.20435 22 5V15C22 15.7957 21.6839 16.5587 21.1213 17.1213C20.5587 17.6839 19.7957 18 19 18H15.5308L15.903 19.4888L16.7071 20.2929C16.9931 20.5789 17.0787 21.009 16.9239 21.3827C16.7691 21.7564 16.4045 22 16 22H8C7.59554 22 7.2309 21.7564 7.07612 21.3827C6.92134 21.009 7.0069 20.5789 7.29289 20.2929L8.09704 19.4888L8.46922 18H5C4.20435 18 3.44129 17.6839 2.87868 17.1213C2.31607 16.5587 2 15.7956 2 15V5C2 4.20435 2.31607 3.44129 2.87868 2.87868ZM4 14H20V15C20 15.2652 19.8946 15.5196 19.7071 15.7071C19.5196 15.8946 19.2652 16 19 16H5C4.73478 16 4.48043 15.8946 4.29289 15.7071C4.10536 15.5196 4 15.2652 4 15V14ZM20 12H4V5C4 4.73478 4.10536 4.48043 4.29289 4.29289C4.48043 4.10536 4.73478 4 5 4H19C19.2652 4 19.5196 4.10536 19.7071 4.29289C19.8946 4.48043 20 4.73478 20 5V12ZM10.5308 18L10.0308 20H13.9692L13.4692 18H10.5308Z"
                />
              </svg>
            </IconButton>
          </Tooltip>

          <ScreensPopover
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
          >
            {screens}
          </ScreensPopover>
        </Box>
      )}
    </>
  )
}
