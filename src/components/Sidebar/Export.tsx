import React, { useState, MouseEvent } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ToggleButton from '../ToggleButton'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { exportApp, importApp } from '../../reducers/app'

export default function Export() {
  const dispatch = useAppDispatch()

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget as HTMLButtonElement)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'export-import-menu' : undefined

  return (
    <div>
      <ToggleButton
        title="Export/Import"
        aria-haspopup="true"
        onClick={handleClick}
        aria-describedby={id}
      >
        <svg
          style={{
            width: 18,
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
          />
        </svg>
      </ToggleButton>

      <Menu id={id} anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            dispatch(exportApp())
            setAnchorEl(null)
          }}
        >
          Export settings
        </MenuItem>
        <MenuItem>
          <input
            type="file"
            style={{
              opacity: 0,
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              right: 0,
              width: '100%',
              height: '100%',
            }}
            onChange={event => {
              if (event.target.files) {
                dispatch(importApp(event.target.files[0] as File))
                event.target.value = ''
              }
              setAnchorEl(null)
            }}
          />
          Import settings
        </MenuItem>
      </Menu>
    </div>
  )
}
