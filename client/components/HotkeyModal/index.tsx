import { IModalProps, Modal } from 'office-ui-fabric'
import * as React from 'react'
import FadeIn from 'react-fade-in'
import { GlobalHotKeysProps } from 'react-hotkeys'
import { useTranslation } from 'react-i18next'
import styles from './HotkeyModal.module.scss'
export type IHotkeyModal = GlobalHotKeysProps & IModalProps

export const HotkeyModal = (props: IHotkeyModal) => {
  const { t } = useTranslation()
  return (
    <Modal isOpen={props.isOpen} onDismiss={props.onDismiss} containerClassName={styles.root}>
      <div className={styles.container}>
        <div className={styles.title}>{t('common.shortcuts')}</div>
        <FadeIn>
          {Object.keys(props.keyMap).map((key) => {
            const { name, sequence } = props.keyMap[key] as any
            return (
              <div key={key}>
                <b className={styles.sequence}>{sequence} </b>
                <span>{name}</span>
              </div>
            )
          })}
        </FadeIn>
      </div>
    </Modal>
  )
}
