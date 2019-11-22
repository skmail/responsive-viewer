import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles, fade } from '@material-ui/core/styles'
import classNames from 'classnames'

const useStyles = makeStyles(theme => ({
  button: {
    color: 'rgba(255,255,255,0.7)',
  },
  activeButton: {
    color: theme.palette.primary.contrastText,
    background: theme.palette.primary.main,
    ['&:hover']: {
      background: fade(theme.palette.primary.main, 0.8),
    },
  },
}))

const Toolbar = props => {
  const { syncScroll, toggleSyncScroll } = props
  const classes = useStyles()

  return (
    <div>
      <Tooltip title="Sync Scrolling">
        <IconButton
          size="small"
          onClick={() => toggleSyncScroll()}
          color="secondary"
          classes={{
            root: classNames(
              classes.button,
              syncScroll ? classes.activeButton : null
            ),
          }}
        >
          <svg
            style={{ width: 15 }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-90 0 512 512"
          >
            <path
              d="M166.238281 430.144531L76.46875 335.246094l29.058594-27.488282 60.632812 64.097657 60.273438-64.058594 29.132812 27.410156zM332 392V120C332 53.832031 278.167969 0 212 0h-92C53.832031 0 0 53.832031 0 120v272c0 66.167969 53.832031 120 120 120h92c66.167969 0 120-53.832031 120-120zM212 40c44.113281 0 80 35.886719 80 80v272c0 44.113281-35.886719 80-80 80h-92c-44.113281 0-80-35.886719-80-80V120c0-44.113281 35.886719-80 80-80zm-46 41c-11.046875 0-20 8.953125-20 20s8.953125 20 20 20 20-8.953125 20-20-8.953125-20-20-20zm0 80c-11.046875 0-20 8.953125-20 20s8.953125 20 20 20 20-8.953125 20-20-8.953125-20-20-20zm0 80c-11.046875 0-20 8.953125-20 20s8.953125 20 20 20 20-8.953125 20-20-8.953125-20-20-20zm0 0"
              fill="currentColor"
            />
          </svg>
        </IconButton>
      </Tooltip>
    </div>
  )
}

export default Toolbar
