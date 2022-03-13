import React, { useMemo, memo } from 'react'
import { getDomId } from '../../utils/screen'
import Iframe from './Iframe'
import Header from './Header'
import { styled } from '@mui/material/styles'

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}))
interface Props {
  id: string
}
const Screen = ({ id }: Props) => {
  const domId = useMemo(() => getDomId(id), [id])
  return (
    <Root id={domId} key={id}>
      <Header id={id} />
      <Iframe id={id} />
    </Root>
  )
}

export default memo(Screen)
