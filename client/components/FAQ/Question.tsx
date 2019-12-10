
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown/with-html';

/**
 * @component Question
 * @description 
 */
export const Question = ({ id, parent, question, answer }) => {
    return (
        <div className="panel panel-default ">
            <div className="panel-heading accordion-toggle collapsed question-toggle" data-toggle="collapse" data-parent={parent} data-target={`#${id}`}>
                <h4 className="panel-title">
                    <a href="#" className="ing">{question}</a>
                </h4>
            </div>
            <div id={id} className="panel-collapse collapse" style={{ height: 0 }}>
                <div className="panel-body">
                    <ReactMarkdown source={answer} />
                </div>
            </div>
        </div>
    );
}