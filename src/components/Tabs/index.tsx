import React from 'react'
import MuiTabs from '@mui/material/Tabs'
import MuiTab from '@mui/material/Tab'
import {
  selectSelectedTabIndex,
  setTabByIndex,
  selectTabs,
} from '../../reducers/app'
import { useAppSelector } from '../../hooks/useAppSelector'
import { toggleTabDialog } from '../../reducers/layout'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { styled, darken } from '@mui/material/styles'
import Add from '@mui/icons-material/Add'

const StyledTabs = styled(MuiTabs)(({ theme }) => ({
  height: 30,
  minHeight: 'auto',
  background: darken(theme.palette.background.paper, 0.4),
}))
const StyledTab = styled(MuiTab)(({ theme }) => ({
  height: 30,
  minHeight: 'auto',
  fontSize: 11,
  fontWeight: 'bold',
}))
const Tabs = () => {
  const tabs = useAppSelector(selectTabs)
  const value = useAppSelector(selectSelectedTabIndex)

  const dispatch = useAppDispatch()

  const handleChange = (e: any, index: number) => {
    if (index === -1) {
      dispatch(toggleTabDialog())
      return
    }
    dispatch(setTabByIndex(index))
  }

  return (
    <div>
      <StyledTabs
        value={value}
        onChange={handleChange}
        aria-label="Screen tabs"
      >
        {tabs.map((tab, index) => (
          <StyledTab
            onDoubleClick={e => {
              if (tab.name !== 'default') {
                e.preventDefault()
                e.stopPropagation()
                dispatch(toggleTabDialog(tab))
              }
            }}
            label={tab.name}
            value={index}
            key={tab.name}
          />
        ))}

        <StyledTab label={<Add />} value={-1} />
      </StyledTabs>
    </div>
  )
}

export default Tabs
