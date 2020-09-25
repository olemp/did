import { useMutation } from '@apollo/react-hooks'
import { getIcons } from 'common/icons'
import { IconPicker, LabelPicker, SearchCustomer, useMessage, UserMessage } from 'components'
import { Toggle } from 'office-ui-fabric-react'
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button'
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { first, pick } from 'underscore'
import styles from './CreateProjectForm.module.scss'
import CREATE_OR_UPDATE_PROJECT, { ICreateOrUpdateProjectVariables, IProjectInput } from './CREATE_OR_UPDATE_PROJECT'
import { IProjectFormProps, IProjectFormValidation } from './types'

const initialModel: IProjectInput = {
    key: '',
    name: '',
    customerKey: '',
    description: '',
    inactive: false,
    icon: first(getIcons(1)),
    labels: [],
}

/**
 * @category Projects
 */
export const ProjectForm = ({ edit, onSubmitted, nameLength = [2] }: IProjectFormProps) => {
    const editMode = !!edit
    const { t } = useTranslation()
    const [validation, setValidation] = useState<IProjectFormValidation>({ errors: {}, invalid: true })
    const [message, setMessage] = useMessage()
    const [model, setModel] = useState<IProjectInput>(edit
        ? { ...edit, labels: edit.labels.map(lbl => lbl.name) }
        : initialModel
    )
    const [createOrUpdateProject, { loading }] = useMutation<any, ICreateOrUpdateProjectVariables>(CREATE_OR_UPDATE_PROJECT)

    /**
     * On validate form
     */
    const validateForm = (): IProjectFormValidation => {
        const [nameMinLength] = nameLength
        const errors: { [key: string]: string } = {}
        if (!model.customerKey) errors.customerKey = ''
        if (model.name.length < nameMinLength) errors.name = t('projects.nameFormValidationText', { nameMinLength })
        if (!(/(^[A-ZÆØÅ0-9]{2,8}$)/gm).test(model.key)) errors.key = t('projects.keyFormValidationText', { keyMinLength: 2, keyMaxLength: 8 })
        return { errors, invalid: Object.keys(errors).length > 0 }
    }

    /**
     * On form submit
     */
    const onFormSubmit = async () => {
        const _validation = validateForm()
        if (_validation.invalid) {
            setValidation(_validation)
            return
        }
        setValidation({ errors: {}, invalid: false })
        const { data: { result } } = await createOrUpdateProject({
            variables: {
                project: pick(model, ...Object.keys(initialModel) as any) as IProjectInput,
                update: editMode,
            }
        })
        if (result.success) {
            if (editMode) {
                if (onSubmitted) setTimeout(onSubmitted, 1000)
            } else {
                setMessage({ text: t('projects.createSuccess', { name: model.name }), type: MessageBarType.success })
                setModel(initialModel)
            }
        }
        else setMessage({ text: result.error.message, type: MessageBarType.error })
    }

    return (
        <div className={styles.root}>
            {message && (
                <UserMessage
                    {...message}
                    containerStyle={{ marginTop: 12, marginBottom: 12, width: 450 }} />
            )}
            <SearchCustomer
                hidden={editMode}
                label={t('common.customer')}
                required={true}
                className={styles.inputField}
                placeholder={t('common.searchPlaceholder')}
                onSelected={customer => setModel({
                    ...model,
                    customerKey: customer && customer.key,
                })} />
            <TextField
                disabled={editMode}
                className={styles.inputField}
                label={t('common.keyFieldLabel')}
                description={t('projects.keyFieldDescription', { keyMaxLength: 8 })}
                required={true}
                errorMessage={validation.errors.key}
                onChange={(_event, key) => setModel({ ...model, key })}
                value={model.key} />
            <TextField
                className={styles.inputField}
                label={t('common.nameFieldLabel')}
                required={true}
                errorMessage={validation.errors.name}
                onChange={(_event, name) => setModel({ ...model, name })}
                value={model.name} />
            <TextField
                className={styles.inputField}
                label={t('common.descriptionFieldLabel')}
                multiline={true}
                errorMessage={validation.errors.description}
                onChange={(_event, description) => setModel({ ...model, description })}
                value={model.description} />
            <IconPicker
                className={styles.inputField}
                defaultSelected={model.icon}
                label={t('common.iconLabel')}
                placeholder={t('common.iconSearchPlaceholder')}
                width={300}
                onSelected={icon => setModel({ ...model, icon })} />
            <div className={styles.inputField} hidden={!editMode}>
                <Toggle
                    label={t('common.inactiveFieldLabel')}
                    defaultChecked={model.inactive}
                    onChanged={inactive => setModel({ ...model, inactive })} />
                <span className={styles.inputDescription}>{t('projects.inactiveFieldDescription')}</span>
            </div>
            <LabelPicker
                className={styles.inputField}
                label={t('admin.labels')}
                searchLabelText={t('admin.filterLabels')}
                defaultSelectedKeys={editMode ? edit.labels.map(lbl => lbl.name) : []}
                onChange={labels => setModel({ ...model, labels: labels.map(lbl => lbl.name) })} />
            <PrimaryButton
                className={styles.inputField}
                text={editMode ? t('common.save') : t('common.add')}
                onClick={onFormSubmit}
                disabled={loading || !!message} />
        </div>
    )
}