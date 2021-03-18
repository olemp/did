/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable tsdoc/syntax */
import { Label, TooltipHost } from 'office-ui-fabric-react'
import React, { useRef } from 'react'
import SketchPicker from 'react-color/lib/components/sketch/Sketch'
import styles from './ColorPickerField.module.scss'
import { IColorPickerFieldProps } from './types'

/**
 * @category Function Component
 */
export const ColorPickerField = (props: IColorPickerFieldProps) => {
  const tooltipRef = useRef(null)
  return (
    <div className={`${props.className} ${styles.root}`}>
      <Label>{props.label}</Label>
      <TooltipHost
        calloutProps={{ target: tooltipRef?.current }}
        tooltipProps={{
          onRenderContent: () => (
            <SketchPicker
              color={props.color}
              onChange={({ hex }) => props.onChanged(hex)}
            />
          )
        }}>
        <span
          ref={tooltipRef}
          className={styles.colorPreview}
          style={{ backgroundColor: props.color }}></span>
      </TooltipHost>
    </div>
  )
}

export * from './types'
