import React, { useMemo } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { useAppSelector } from '../../hooks/useAppSelector'
import { selectViewMode, switchViewMode } from '../../reducers/app'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { ViewMode as ViewModeEnum } from '../../types'
import { styled } from '@mui/material/styles'

const Icon = styled('svg')(({ theme }) => ({
  width: theme.spacing(3),
  height: theme.spacing(3),
}))

const ViewMode = () => {
  const dispatch = useAppDispatch()
  const viewMode = useAppSelector(selectViewMode)
  const modes = useMemo(
    () => [
      {
        name: ViewModeEnum.vertical,
        label: 'Stack screens on grid',
        icon: (
          <Icon
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 4h6a1 1 0 011 1v4a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1zM3 14h6a1 1 0 011 1v4a1 1 0 01-1 1H3a1 1 0 01-1-1v-4a1 1 0 011-1zM15 4h6a1 1 0 011 1v4a1 1 0 01-1 1h-6a1 1 0 01-1-1V5a1 1 0 011-1zM15 14h6a1 1 0 011 1v4a1 1 0 01-1 1h-6a1 1 0 01-1-1v-4a1 1 0 011-1z"
              strokeWidth={2}
            />
          </Icon>
        ),
      },
      {
        name: ViewModeEnum.horizontal,
        label: 'Stack screens horizontally',
        icon: (
          <Icon
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.28 7.25c.046-.116.09-.196.123-.25h3.194c.034.054.077.134.123.25C5.88 7.648 6 8.266 6 9v6c0 .734-.12 1.352-.28 1.75a1.58 1.58 0 01-.123.25H2.403a1.579 1.579 0 01-.123-.25C2.12 16.352 2 15.734 2 15V9c0-.734.12-1.352.28-1.75zM9.28 7.25c.046-.116.09-.196.123-.25h3.194c.034.054.077.134.123.25.16.398.28 1.016.28 1.75v6c0 .734-.12 1.352-.28 1.75-.046.116-.09.196-.123.25H9.403a1.579 1.579 0 01-.123-.25C9.12 16.352 9 15.734 9 15V9c0-.734.12-1.352.28-1.75zM16.351 7.35c.142-.267.248-.335.278-.35h4.742c.03.015.136.083.278.35.198.37.351.952.351 1.65v6c0 .697-.153 1.28-.351 1.65-.142.267-.248.335-.278.35h-4.742c-.03-.015-.136-.084-.278-.35-.198-.37-.351-.952-.351-1.65V9c0-.698.153-1.28.351-1.65z"
              strokeWidth={2}
            />
          </Icon>
        ),
      },
    ],
    []
  )

  const mode = viewMode === ViewModeEnum.vertical ? modes[1] : modes[0]

  return (
    <Tooltip arrow title={mode.label}>
      <IconButton
        value={mode.name}
        onClick={() => dispatch(switchViewMode(mode.name))}
      >
        {mode.icon}
      </IconButton>
    </Tooltip>
  )
}

export default ViewMode
