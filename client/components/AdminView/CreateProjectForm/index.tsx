import { useMutation } from '@apollo/react-hooks';
import { UserMessage } from 'components/UserMessage';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { useState } from 'react';
import CREATE_PROJECT from './CREATE_PROJECT';
import { ICreateProjectFormModel } from './ICreateProjectFormModel';

/**
 * @component CreateProjectForm
 * @description Form for creating a new Project
 */
export const CreateProjectForm = ({ emptyModel = { customerKey: '', projectKey: '', name: '', icon: 'Page' } }) => {
    let [message, setMessage] = useState<{ text: string, type: MessageBarType }>(null);
    let [model, setModel] = useState<ICreateProjectFormModel>(emptyModel);
    let [addProject, { loading }] = useMutation(CREATE_PROJECT);

    const onFormSubmit = async () => {
        let { data: { result } } = await addProject({ variables: model });
        if (result.success) {
            setMessage({ text: `The project ${model.name} was succesfully created.`, type: MessageBarType.success })
        } else {
            setMessage({ text: result.error, type: MessageBarType.error });
        }
        setModel(emptyModel);
        window.setTimeout(() => {
            setMessage(null);
        }, 5000);
    }

    /**
     * Validate model
     * 
     * @description Temp validation of model
     */
    const validateModel = (): boolean => {
        return model.name.length > 2 && model.projectKey.length > 2 && model.name.length > 2;
    }

    return (
        <div>
            <TextField
                styles={{ root: { marginTop: 12, width: 300 } }}
                minLength={4}
                placeholder='Customer Key'
                description={`For now you'll have to enter the customer key. Later on this will be a dropdown with autocomplete functionality. Use one word (no spaces).`}
                onChange={(_event, customerKey) => setModel({ ...model, customerKey })}
                value={model.customerKey} />
            <TextField
                styles={{ root: { marginTop: 12, width: 300 } }}
                minLength={4}
                placeholder='Key'
                description='Key for the project. Use one word (no spaces).'
                onChange={(_event, projectKey) => setModel({ ...model, projectKey })}
                value={model.projectKey} />
            <TextField
                styles={{ root: { marginTop: 12, width: 300 } }}
                minLength={4}
                placeholder='Name'
                description='Name of the project.'
                onChange={(_event, name) => setModel({ ...model, name })}
                value={model.name} />
            <TextField
                styles={{ root: { marginTop: 12, width: 300 } }}
                minLength={4}
                placeholder='Icon'
                description='Icon to illustrate the project (https://developer.microsoft.com/en-us/fabric#/styles/web/icons).'
                onChange={(_event, icon) => setModel({ ...model, icon })}
                iconProps={{ iconName: model.icon }}
                value={model.icon} />
            <PrimaryButton
                styles={{ root: { marginTop: 16 } }}
                text='Add'
                iconProps={{ iconName: 'CirclePlus' }}
                onClick={onFormSubmit}
                disabled={loading || !validateModel()} />
            {message && <UserMessage style={{ marginTop: 10 }} text={message.text} type={message.type} />}
        </div>
    );
}