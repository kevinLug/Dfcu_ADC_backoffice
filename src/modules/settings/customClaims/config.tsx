import React from "react";
import {hasValue} from "../../../components/inputs/inputHelpers";
import {authEditableClaims} from "../users/details/ClaimsList";
import Toast from "../../../utils/Toast";
import {IColumn, InputType} from "../../../components/dynamic-editor/types";
import {reqString} from "../../../data/validations";
import * as yup from "yup";

export const createEditColumns = (isNew: boolean): IColumn[] => {
    const toReturn: IColumn[] = [
        {
            name: "email",
            label: 'email',
            inputType: InputType.Text,
            inputProps: {
                variant: 'outlined',
                disabled: !isNew
            }
        }
    ]
    authEditableClaims.forEach(it => {
        toReturn.push({
            name: it,
            label: it,
            inputType: InputType.Text,
            inputProps: {
                variant: 'outlined'
            }
        })
    })
    return toReturn;
}


export const toAuthCustomClaimObject = (data: any) => {
    try {
        const sample: any = {
            id: data.email,
            claims: []
        }
        authEditableClaims.forEach(it => {
            if (hasValue(data[it])) {
                sample.claims.push({
                    "type": it,
                    "value": data[it]
                })
            }
        })
        return sample
    } catch (e) {
        console.error(e)
        Toast.error("Invalid claims data")
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
        Toast.error("Invalid claims data")
    }
}

export const customClaimsSchema = () => {
    const schema: any = {
        email: reqString
    }
    authEditableClaims.forEach((it: any) => {
        schema[it] = reqString
    })
    return yup.object().shape(
        schema
    )
}


