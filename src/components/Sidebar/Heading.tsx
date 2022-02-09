import React, { ReactNode } from 'react'
import Typography from '@mui/material/Typography'

interface Props {
  children: ReactNode
}
export const Heading = ({ children }: Props) => {
  return <Typography variant={'subtitle2'}>{children}</Typography>
}

export default Heading
