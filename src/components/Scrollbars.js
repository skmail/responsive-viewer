import React, { useEffect, useRef } from 'react'

import SimpleBar from 'react-custom-scrollbars-2'
const Scrollbars = ({ ...props }) => {
  const ref = useRef()

  useEffect(() => {
    // console.log(ref.current.el)
  }, [])
  return <SimpleBar ref={ref} {...props} />
}

export default Scrollbars
