import React from 'react'

import Button from '@mui/material/Button'
import { useAppSelector } from '../../../hooks/useAppSelector'
import {
  nextPage,
  previousPage,
  selectHasNextPage,
  selectHasPreviousPage,
} from '../../../reducers/draw'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
const Navigation = () => {
  const hasNextPage = useAppSelector(selectHasNextPage)
  const hasPreviousPage = useAppSelector(selectHasPreviousPage)
  const dispatch = useAppDispatch()

  return (
    <>
      <Button
        disabled={!hasPreviousPage}
        onClick={() => {
          dispatch(previousPage())
        }}
      >
        Previous
      </Button>
      <Button
        disabled={!hasNextPage}
        onClick={() => {
          dispatch(nextPage())
        }}
      >
        Next
      </Button>
    </>
  )
}

export default Navigation
