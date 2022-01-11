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

const TabLabel = ({ tab, isSelected }) => {
  const ref = useRef()
  const dispatch = useDispatch()
  return (
    <span ref={ref}>
      {tab.name}

      {tab.name !== 'default' && (
        <Popper
          placement="right"
          id={`${tab.name}-popper`}
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [5, 0],
              },
            },
          ]}
          open={isSelected}
          anchorEl={ref.current}
        >
          <IconButton
            defaultComponent="div"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              dispatch(toggleTabDialog(tab))
            }}
            size="small"
          >
            <InfoIcon fontSize="small" />
          </IconButton>
        </Popper>
      )}
    </span>
  )
}

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
            label={<TabLabel tab={tab} isSelected={index === value} />}
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
