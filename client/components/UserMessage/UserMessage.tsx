import {
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Title3
} from '@fluentui/react-components'
import { ConditionalWrapper } from 'components'
import { Progress } from 'components/Progress'
import { ReusableComponent } from 'components/types'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { getFluentIcon } from 'utils'
import styles from './UserMessage.module.scss'
import { UserMessageAction } from './UserMessageAction/UserMessageAction'
import { IUserMessageProps } from './types'
import { useUserMessage } from './useUserMessage'

/**
 * A component that uses `MessageBar` from [@fluentui/react-components](@fluentui/react-components),
 * conditionally renders a `Menu` from [@fluentui/react-components](@fluentui/react-components), or
 * a `Popover` from [@fluentui/react-components](@fluentui/react-components) based on the presence of
 * the `popover` prop.
 *
 * @category Reusable Component
 */
export const UserMessage: ReusableComponent<IUserMessageProps> = (props) => {
  const { containerProps, alertStyle } = useUserMessage(props)
  return (
    <div {...containerProps}>
      <ConditionalWrapper
        condition={!!props.popover}
        wrapper={(children) => (
          <Popover closeOnScroll>
            <PopoverTrigger>
              <div>
                {children}
              </div>
            </PopoverTrigger>
            <PopoverSurface>
              {props.popover?.text ?? props.popover?.children}
            </PopoverSurface>
          </Popover>
        )}>
        <MessageBar
          {...props}
          icon={props.iconName && getFluentIcon(props.iconName)}
          style={alertStyle}
          className={styles.alert}
          layout='auto'
          politeness='assertive'
        >
          <MessageBarBody>
            {props.headerText && (
              <Title3 className={styles.header}>{props.headerText}</Title3>
            )}
            {props.renderProgress[0] && (
              <Progress text={props.renderProgress[1] ?? props.text} />
            )}
            {props.text && !props.renderProgress[0] && (
              <div className={styles.flex}>
                <ReactMarkdown
                  className={styles.text}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                >
                  {props.text}
                </ReactMarkdown>
              </div>
            )}
            {props.children}
          </MessageBarBody>
          {props.action && (
            <MessageBarActions
              containerAction={<UserMessageAction {...props.action} />}
            />
          )}
        </MessageBar>
      </ConditionalWrapper>
    </div>
  )
}

UserMessage.className = styles.userMessage
UserMessage.defaultProps = {
  intent: 'info',
  renderProgress: [false, null]
}
