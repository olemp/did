
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown/with-html';
import { IUserMessageProps } from './IUserMessageProps';

/**
 * @component UserMessage
 * @description @todo
 */
export const UserMessage = ({ text, onClick = undefined, type = MessageBarType.info, iconName, hidden, style, children }: IUserMessageProps) => {
    return (
        <div
            className='c-usermessage'
            hidden={hidden}
            onClick={onClick}>
            <MessageBar style={style} messageBarType={type} messageBarIconProps={iconName && { iconName }}>
                {text && <ReactMarkdown source={text} escapeHtml={false} skipHtml={false} />}
                {children && children}
            </MessageBar>
        </div>
    );
}