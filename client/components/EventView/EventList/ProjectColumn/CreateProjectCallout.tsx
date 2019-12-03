
import { useMutation } from '@apollo/react-hooks';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Callout } from 'office-ui-fabric-react/lib/Callout';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { useState } from 'react';
import CREATE_PROJECT from './CREATE_PROJECT';

/**
 * @component CreateProjectCallout
 * @description @todo
 */
export const CreateProjectCallout = ({ customerKey, projectKey, target, onDismiss, onAdded }) => {
    let [model, setModel] = useState({ customerKey, projectKey, name: '' });
    let [addProject, { loading }] = useMutation(CREATE_PROJECT);
    const onFormSubmit = () => addProject({ variables: model }).then(onAdded);

    return (
        <Callout
            className='c-createprojectcallout-callout'
            hidden={!target}
            target={target}
            onDismiss={onDismiss}>
            <h5>Create new project</h5>
            <TextField
                styles={{ root: { marginTop: 16 } }}
                placeholder={'Customer'}
                defaultValue={model.customerKey}
                disabled />
            <TextField
                styles={{ root: { marginTop: 8 } }}
                placeholder={'Key'}
                defaultValue={model.projectKey}
                disabled />
            <TextField
                styles={{ root: { marginTop: 8 } }}
                placeholder='Name'
                onChange={(_event, name) => setModel({ ...model, name })}
                disabled={loading} />
            <DefaultButton
                styles={{ root: { marginTop: 16, width: '100%' } }}
                text='Add'
                iconProps={{ iconName: 'CirclePlus' }}
                onClick={onFormSubmit}
                disabled={model.name.length < 3 || loading} />
        </Callout>
    );
}