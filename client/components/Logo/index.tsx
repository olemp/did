import { Caption1 } from '@fluentui/react-components'
import { ReusableComponent } from 'components/types'
import packageFile from 'package'
import React from 'react'
import styles from './Logo.module.scss'
import { ILogoProps } from './types'

/**
 * @category Reusable Component
 */
export const Logo: ReusableComponent<ILogoProps> = (props) => {
  return (
    <div className={Logo.className}>
      <div
        className={`${styles.logo} ${props.dropShadow ? styles.dropShadow : ''}`}
        style={{ width: props.width, height: props.height }}
      >
        <svg
          id='didlogo_1'
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          version='1.1'
          viewBox='0 0 139.92 174.41'
        >
          <defs>
            <style>
              {`.logo-1{fill:${props.fillColor};stroke:${props.strokeColor};stroke-miterlimit:10;stroke-width:${props.strokeWidth};}`}
            </style>
          </defs>
          <g id='did-logo_1-1'>
            <path
              className='logo-1'
              d='m11.1,163.3c6.24,6.25,14.86,10.11,24.39,10.11h68.96v-34.48H35.48v-34.48H1v34.48c0,9.52,3.86,18.14,10.1,24.38Z'
            />
            <path
              className='logo-1'
              d='m104.44,138.92h34.48V35.47c0-19.04-15.43-34.47-34.48-34.47v68.96H35.48v34.48h68.96v34.48Z'
            />
          </g>
        </svg>
      </div>
      {props.showMotto && <Caption1
        className={styles.motto}>{packageFile.description}</Caption1>}
    </div>
  )
}

Logo.displayName = 'Logo'
Logo.className = styles.logo
Logo.defaultProps = {
  showMotto: false,
  fillColor: 'transparent',
  strokeColor: '#3a0960',
  strokeWidth: '2px',
  backgroundColor: 'transparent',
  dropShadow: false,
  width: '200px',
  height: '100%'
}

export * from './types'
