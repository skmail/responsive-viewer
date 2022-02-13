import React, { useEffect, useRef } from 'react'
import Button from '@mui/material/Button'
import { useStageContext } from '../contexts/StageProvider'
import { useAppSelector } from '../../../hooks/useAppSelector'
import {
  selectSelectedElement,
  selectSelectedPage,
} from '../../../reducers/draw'
import { ToZipInput } from '../../../types'
import { toZip } from '../../../utils/toZip'
import { saveAs } from '../../../utils/saveAs'
import { selectUrl } from '../../../reducers/app'
import { extractHostname } from '../../../utils/url'

const Download = () => {
  const { getRef } = useStageContext()
  const images = useRef<Map<string, string>>(new Map())
  const element = useAppSelector(selectSelectedElement)
  const pageName = useAppSelector(state => selectSelectedPage(state)?.name)
  const url = useAppSelector(selectUrl)
  const download = async () => {
    const files: ToZipInput = []

    images.current.forEach((url, name) => {
      files.push({
        filename: name,
        url: url,
      })
    })

    const zip = await toZip(files)

    saveAs(zip, `${extractHostname(url)}-screenshots.zip`)
  }

  useEffect(() => {
    const stage = getRef('stage')
    const transformer = getRef('transformer')
    if (!stage || !stage.width() || !stage.height()) {
      return
    }

    const timer = setTimeout(() => {
      transformer?.hide()
      images.current.set(pageName, stage.toDataURL())
      transformer?.show()
    }, 50)

    return () => {
      clearTimeout(timer)
    }
  }, [pageName, element, getRef])
  return (
    <Button autoFocus onClick={download}>
      Download
    </Button>
  )
}

export default Download
