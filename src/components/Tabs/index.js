import React, { useEffect, useRef, useState } from 'react'
import MuiTabs from '@material-ui/core/Tabs'
import { useSelector } from 'react-redux'
import { getSelectedTabIndex, getTabs } from '../../selectors'
import { makeStyles, alpha } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import { useDispatch } from 'react-redux'
import { selectTabByIndex, toggleTabDialog } from '../../actions'
import MuiTab from '@material-ui/core/Tab'
import Popper from '@material-ui/core/Popper'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import { IconButton } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    width: `calc( (100vw - ${theme.drawerWidth}px))`,
    marginLeft: theme.drawerWidth,
    background: alpha(theme.palette.grey['900'], 0.5),
    minHeight: 'auto',
  },
  tab: {
    fontSize: theme.typography.pxToRem(11),
    fontWeight: theme.typography.fontWeightBold,
    padding: theme.spacing(0.5, 2),
    minWidth: 'auto',
    minHeight: 'auto',
  },
}))

const Tabs = () => {
  const tabs = useSelector(getTabs)
  const value = useSelector(getSelectedTabIndex)

  const classes = useStyles()
  const dispatch = useDispatch()

  const handleChange = (e, index) => {
    if (index === false) {
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
          value={false}
        />
      </MuiTabs>
    </div>
  )
}

export default Tabs
