import React from 'react'
import MuiTabs from '@material-ui/core/Tabs'
import { makeStyles, darken } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import MuiTab from '@material-ui/core/Tab'
import {
  selectSelectedTabIndex,
  selectTabByIndex,
  selectTabs,
} from '../../reducers/app'
import { useAppSelector } from '../../hooks/useAppSelector'
import { toggleTabDialog } from '../../reducers/layout'
import { useAppDispatch } from '../../hooks/useAppDispatch'

const useStyles = makeStyles(theme => ({
  root: {
    background: darken(theme.palette.secondary.dark, 0.7),
    minHeight: 'auto',
  },
  tab: {
    fontSize: theme.typography.pxToRem(11),
    fontWeight: 'bold',
    padding: theme.spacing(0.5, 2),
    minWidth: 'auto',
    minHeight: 'auto',
  },
}))

const Tabs = () => {
  const tabs = useAppSelector(selectTabs)
  const value = useAppSelector(selectSelectedTabIndex)

  const classes = useStyles()
  const dispatch = useAppDispatch()

  const handleChange = (e: any, index: number) => {
    if (index === -1) {
      dispatch(toggleTabDialog())
      return
    }
    dispatch(selectTabByIndex(index))
  }

  return (
    <div>
      <MuiTabs
        className={classes.root}
        value={value}
        onChange={handleChange}
        aria-label="Screen tabs"
      >
        {tabs.map((tab, index) => (
          <MuiTab
            wrapped={false}
            classes={{ root: classes.tab }}
            fullWidth={false}
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

        <MuiTab
          icon={<AddIcon />}
          classes={{ root: classes.tab }}
          fullWidth={false}
          value={-1}
        />
      </MuiTabs>
    </div>
  )
}

export default Tabs
