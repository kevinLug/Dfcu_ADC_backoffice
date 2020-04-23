import * as yup from "yup";

export const invalidInputs = [null, 'null', 'undefined', undefined, '']
export const reqMsg = 'Input is required'
export const nullableString = yup.string().nullable(true)
export const reqString = yup.string().required(reqMsg).notOneOf(invalidInputs, reqMsg)
export const yupString = yup.string().notOneOf(invalidInputs, reqMsg)
export const reqNumber = yup.number().required(reqMsg)
export const reqPhoneNumber = yup.string()
    .required(reqMsg)
    .matches(/^\+256([37])[0-9]{8}$/, {
        message: "Must be a valid ugandan number",
        excludeEmptyString: true
    })
    .nullable(true)
export const reqEmail = yup.string().email('Must be a valid email').required("Email is required")
export const email = yup.string().email('Must be a valid email')
export const reqDate = yup.date().required(reqMsg).notOneOf(invalidInputs, reqMsg).nullable(true)
