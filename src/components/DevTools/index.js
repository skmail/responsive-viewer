import React, { useState } from 'react'
import Paper from '@material-ui/core/Paper'
import { makeStyles, alpha } from '@material-ui/core/styles'
import MuiTab from '@material-ui/core/Tab'
import MuiTabs from '@material-ui/core/Tabs'

const useStyles = makeStyles(theme => {
  return {
    root: {
      height: '150px',
      background: alpha(theme.palette.grey['900'], 0.5),
      borderTopWidth: 1,
      borderTopStyle: 'solid',
      borderTopColor: theme.palette.grey['800'],
      borderRadius: 0,
      padding: theme.spacing(1),
    },
    tabs: {
      minHeight: 'auto',
      margin: theme.spacing(-1, -1, 0, -1),
    },
    tab: {
      fontSize: theme.typography.pxToRem(11),
      fontWeight: theme.typography.fontWeightBold,
      padding: theme.spacing(0.5, 2),
      minWidth: 'auto',
      minHeight: 'auto',
    },
  }
})

const tabs = ['CSS OVERVIEW']
const DevTools = () => {
  const classes = useStyles()
  const [tab, setSelectedTab] = useState(0)
  const handleTabChange = (e, index) => {
    setSelectedTab(index)
  }

  return (
    <div className={classes.root}>
      <MuiTabs
        className={classes.tabs}
        value={tab}
        onChange={handleTabChange}
        aria-label="Screen tabs"
      >
        {tabs.map((tab, index) => (
          <MuiTab
            wrapped={false}
            classes={{ root: classes.tab }}
            fullWidth={false}
            label={tab}
            value={index}
            key={tab}
          />
        ))}
      </MuiTabs>
    </div>
  )
}

export default DevTools
