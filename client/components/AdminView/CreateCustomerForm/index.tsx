import * as React from 'react';
import { useState } from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { useMutation } from '@apollo/react-hooks';
import CREATE_CUSTOMER from './CREATE_CUSTOMER';
import { UserMessage } from 'components/UserMessage';


/**
 * @component CreateCustomerForm
 * @description 
 */
export const CreateCustomerForm = ({ emptyModel = { key: '', name: '' } }) => {
    let [message, setMessage] = useState<{ text: string, type: MessageBarType }>(null);
    let [model, setModel] = useState(emptyModel);
    let [addCustomer, { loading }] = useMutation(CREATE_CUSTOMER);

    const onFormSubmit = async () => {
        let { data: { result } } = await addCustomer({ variables: model });
        if (result.success) {
            setMessage({ text: `The customer ${model.name} was succesfully created.`, type: MessageBarType.success });
        } else {
            setMessage({ text: result.error, type: MessageBarType.error });
        }
        setModel(emptyModel);
        window.setTimeout(() => setMessage(null), 5000);
    }

    return (
        <div>
            <TextField
                styles={{ root: { marginTop: 12, width: 300 } }}
                minLength={4}
                placeholder='Key'
                description='Key for the customer. Use one word (no spaces).'
                onChange={(_event, key) => setModel({ ...model, key })}
                value={model.key} />
            <TextField
                styles={{ root: { marginTop: 12, width: 300 } }}
                minLength={4}
                placeholder='Name'
                onChange={(_event, name) => setModel({ ...model, name })}
                value={model.name} />
            <PrimaryButton
                styles={{ root: { marginTop: 16 } }}
                text='Add'
                iconProps={{ iconName: 'CirclePlus' }}
                onClick={onFormSubmit}
                disabled={model.name.length < 3 || model.key.length < 3 || loading || !!message} />
            {message && <UserMessage marginTop={20} text={message.text} type={message.type} />}
        </div>
    );
}