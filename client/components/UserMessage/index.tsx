
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';

export const UserMessage = ({ text, type, iconProps = undefined, hidden = false, marginTop = 0 }) => {
    return (
        <div className='c-usermessage' style={{ marginTop }} hidden={hidden}>
            <MessageBar messageBarType={type} messageBarIconProps={iconProps}>
                <ReactMarkdown source={text} />
            </MessageBar>
        </div>
    );
}