import React, { SVGAttributes } from 'react'

const AppLogo = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      fill="none"
      viewBox="0 0 320 220"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="10.5"
        y="10.5"
        width="299"
        height="199"
        rx="19.5"
        fill="#F5C644"
        stroke="#000"
        strokeWidth="21"
      />
      <rect
        x="10.5"
        y="60.5"
        width="110"
        height="149"
        rx="19.5"
        fill="#F5C644"
        stroke="#000"
        strokeWidth="21"
      />
      <rect
        x="90.5"
        y="100.5"
        width="59"
        height="109"
        rx="19.5"
        fill="#F5C644"
        stroke="#000"
        strokeWidth="21"
      />
    </svg>
  )
}

export default AppLogo
