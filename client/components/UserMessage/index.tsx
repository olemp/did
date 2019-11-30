
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown/with-html';

export const UserMessage = ({ text, type = MessageBarType.info, iconName = undefined, hidden = false, marginTop = 0 }) => {
    return (
        <div className='c-usermessage' style={{ marginTop }} hidden={hidden}>
            <MessageBar messageBarType={type} messageBarIconProps={iconName ? { iconName } : null}>
                <ReactMarkdown source={text} escapeHtml={false} />
            </MessageBar>
        </div>
    );
}