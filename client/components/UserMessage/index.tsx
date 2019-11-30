
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown/with-html';
import { IUserMessageProps } from './IUserMessageProps';

/**
 * @component UserMessage
 * @description @todo
 */
export const UserMessage = ({ text, onClick = null, type = MessageBarType.info, iconName, hidden, marginTop = 0, style }: IUserMessageProps) => {
    return (
        <div
            className='c-usermessage'
            style={{ marginTop }}
            hidden={hidden}
            onClick={onClick}>
            <MessageBar style={style} messageBarType={type} messageBarIconProps={iconName && { iconName }}>
                <ReactMarkdown source={text} escapeHtml={false} skipHtml={false} />
            </MessageBar>
        </div>
    );
}