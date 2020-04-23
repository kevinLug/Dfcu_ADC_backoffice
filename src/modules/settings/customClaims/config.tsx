import React from 'react';
import {hasValue, IOption} from '../../../components/inputs/inputHelpers';

import Toast from '../../../utils/Toast';
import {IColumn, InputType} from '../../../components/dynamic-editor/types';
import {reqEmail, reqNumber, reqPhoneNumber, reqString} from '../../../data/validations';
import * as yup from 'yup';
import {IUserClaim} from "../users/types";
import {branches, regions} from "./region-data";

export interface IAuthCustomClaim {
    name: string
    label: string,
    options?: IOption[]
    rules?: any
    schema?: any
    inputOptions?: any
}

export const authCustomClaims: IAuthCustomClaim[] = [
    {
        name: 'region',
        label: 'Region Code',
        options: regions,
        rules: {
            presence: {allowEmpty: false}
        },

    },
    {
        name: 'branch_name',
        label: 'Branch SolId',
        options: branches,
        rules: {
            presence: {allowEmpty: false},
            format: {
                pattern: /^[0-9]+$/,
                message: "Invalid input"
            }
        },
        schema: reqNumber
    },
    {
        name: 'phone_number',
        label: 'Phone No',
        rules: {
            presence: {allowEmpty: false},
            length: {minimum: 13,maximum: 13},
            format: {
                pattern: /^\+256([37])[0-9]{8}$/,
                message: "Invalid input"
            }
        },
        schema: reqPhoneNumber,
    },
    {
        name: 'agent_code',
        label: 'Agent Code',
        rules: {
            presence: {allowEmpty: false}
        }
    }
]


export const validateUserClaim = (data: IUserClaim): boolean => {
    return true;
}


export const createEditColumns = (isNew: boolean): IColumn[] => {
    const toReturn: IColumn[] = [
        {
            name: 'email',
            label: 'Email',
            inputType: InputType.Text,
            inputProps: {
                variant: 'outlined',
                disabled: !isNew
            }
        }
    ]
    authCustomClaims.forEach(({name, label, ...rest}) => {
        if (hasValue(rest.options)) {
            toReturn.push({
                name,
                label,
                inputType: InputType.Select,
                inputProps: {
                    ...rest.inputOptions,
                    variant: 'outlined',
                    options: rest.options
                }
            })
        } else {
            toReturn.push({
                name,
                label,
                inputType: InputType.Text,
                inputProps: {
                    ...rest.inputOptions,
                    variant: 'outlined'
                }
            })
        }

    })
    return toReturn;
}


export const toAuthCustomClaimObject = (data: any) => {
    try {
        const sample: any = {
            id: data.email,
            claims: []
        }
        authCustomClaims.forEach(({name}) => {
            if (hasValue(data[name])) {
                sample.claims.push({
                    'type': name,
                    'value': data[name]
                })
            }
        })
        return sample
    } catch (e) {
        console.error(e)
        Toast.error('Invalid claims data')
    }
}

export const fromAuthCustomClaimObject = (data: any) => {
    try {
        const sample: any = {
            email: data.id
        }
        data.claims.forEach(({type, value}: any) => {
            sample[type] = value
        })
        return sample
    } catch (e) {
        console.error(e)
        Toast.error('Invalid claims data')
    }
}

export const customClaimsSchema = () => {
    const schemaDef: any = {
        email: reqEmail
    }
    authCustomClaims.forEach(({name, schema}) => {
        schemaDef[name] = hasValue(schema) ? schema : reqString
    })
    return yup.object().shape(
        schemaDef
    )
}


