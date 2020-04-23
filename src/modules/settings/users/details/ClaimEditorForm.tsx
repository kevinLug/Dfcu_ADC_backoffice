import React, {useState} from "react";
import {Grid} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import {IUserClaim} from "../types";
import {remoteRoutes} from "../../../../data/constants";
import {handleError, post, put} from "../../../../utils/ajax";
import Toast from "../../../../utils/Toast";
import {hasNoValue, hasValue} from "../../../../components/inputs/inputHelpers";
import {authCustomClaims} from "../../customClaims/config";
import PSelectInput from "../../../../components/plain-inputs/PSelectInput";
import TextField from "@material-ui/core/TextField";
import validate from "validate.js";

interface IProps {
    isNew: boolean
    initialValues: Partial<IUserClaim>
    done?: () => any
    onNew: (data: IUserClaim) => any
    onEdited: (data: IUserClaim) => any
    list: IUserClaim[]
}

const hasOptions = (field?: string): boolean => {
    const f = authCustomClaims.find(it => it.name === field)
    return Boolean(f && hasValue(f.options))
}

const getOptions = (field?: string): any[] => {
    const f = authCustomClaims.find(it => it.name === field)
    return (f && f.options) ? f.options : []
}

const isValid = (field: string | undefined, value: string | undefined): any => {
    if (!field)
        return false;
    const f = authCustomClaims.find(it => it.name === field)
    const schema = (f && f.rules) ? f.rules : {}
    const res = validate({[field]: value}, {[field]: schema});
    return !!res
}

const ClaimEditorForm = (props: IProps) => {
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [data, setData] = useState<Partial<IUserClaim>>(props.initialValues)

    // Do not allow user to add duplicate claim
    const existingClaims = props.list.map(it => it.claimType)
    const optionList = authCustomClaims
        .map(({name, label}) => ({label, value: name}))

    const claimOptions = props.isNew ? optionList
        .filter(it => existingClaims.indexOf(it.value) < 0) : optionList

    function handleTypeChange(event: React.ChangeEvent<any>) {
        const name = event.target.name
        const value = event.target.value
        const newData = {...data, [name]: value, claimValue: ''}
        setData({...newData})
    }

    function handleValueChange(event: React.ChangeEvent<any>) {
        const name = event.target.name
        const value = event.target.value
        const newData = {...data, [name]: value}
        setData({...newData})
    }

    function handleSubmit() {
        const values = {...data}
        if (hasNoValue(values.claimType) || hasNoValue(values.claimValue)) {
            Toast.warn("Please enter all required fields")
            return;
        }

        if (isValid(values.claimType, values.claimValue)) {
            Toast.warn("Please validate input")
            return;
        }
        setSubmitting(true);
        const url = remoteRoutes.userClaims
        if (props.isNew) {
            post(url, values,
                (data) => {
                    Toast.info('Operation successful')
                    props.onNew(data)
                    setData({...data, claimType: '', claimValue: ''})
                },
                (err, resp) => {
                    handleError(err, resp)
                }, () => {
                    setSubmitting(false);
                }
            )
        } else {
            put(url, values,
                (data) => {
                    Toast.info('Update successful')
                    props.onEdited(data)
                    setData({...data, claimType: '', claimValue: ''})
                },
                (err, resp) => {
                    handleError(err, resp)
                }, () => {
                    setSubmitting(false);
                }
            )
        }
    }

    function handleCancel() {
        setData({...data, claimType: '', claimValue: ''})
        props.done && props.done()
    }

    return <form translate="yes">
        <Grid container spacing={1}>
            <Grid item xs={6}>
                <PSelectInput
                    name="claimType"
                    label="Claim Type"
                    value={data.claimType || ''}
                    options={claimOptions}
                    variant="outlined"
                    onChange={handleTypeChange}
                />
            </Grid>
            <Grid item xs={6}>
                {
                    hasOptions(data.claimType) ?
                        <PSelectInput
                            name="claimValue"
                            label="Claim Value"
                            value={data.claimValue || ''}
                            options={getOptions(data.claimType)}
                            variant="outlined"
                            onChange={handleValueChange}
                        /> :
                        <TextField
                            name="claimValue"
                            label="Claim Value"
                            value={data.claimValue || ''}
                            onChange={handleValueChange}
                            variant="outlined"
                            fullWidth
                        />
                }

            </Grid>
            <Grid item xs={12}>
                <Box p={1}>
                    <Grid container spacing={1} alignContent='flex-end' justify='flex-end'>
                        <Grid item>
                            <Button
                                variant='contained'
                                color='default'
                                onClick={handleCancel}
                                disabled={submitting}
                            >Cancel</Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={handleSubmit}
                                disabled={submitting}
                            >Submit</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    </form>
}

export default ClaimEditorForm
