import React from 'react';
import * as yup from "yup";
import {reqDate, reqEmail, reqNumber, reqString} from "../../../data/validations";
import {idCategories} from "../../../data/comboCategories";
import {FormikActions} from "formik";
import Grid from "@material-ui/core/Grid";
import XForm from "../../../components/forms/XForm";
import XTextInput from "../../../components/inputs/XTextInput";
import XDateInput from "../../../components/inputs/XDateInput";
import {toOptions} from "../../../components/inputs/inputHelpers";

import {remoteRoutes} from "../../../data/constants";
import {useDispatch} from 'react-redux'
import {crmConstants} from "../../../data/redux/contacts/reducer";
import {post} from "../../../utils/ajax";
import Toast from "../../../utils/Toast";
import XSelectInput from "../../../components/inputs/XSelectInput";
import {EmailCategory, IdentificationCategory, PhoneCategory} from "../types";

interface IProps {
    data: any | null
    done?: () => any
}

const schema = yup.object().shape(
    {
        name: reqString,
        category: reqString,
        dateOfPayment: reqDate,
        numberOfEmployees: reqNumber,
        email: reqEmail,
        tinNumber: reqString,
        phone: reqString,
    }
)

const NewCompanyForm = ({data, done}: IProps) => {
    const dispatch = useDispatch();

    function handleSubmit(values: any, actions: FormikActions<any>) {
        const toSave = {
            category: 'Person',
            internalContact: values.internalContact,
            externalContact: values.externalContact,
            company: {
                name: values.name,
                category: values.category,
                dateOfPayment: values.dateOfPayment,
                numberOfEmployees: values.numberOfEmployees
            },
            phones: [
                {
                    category: PhoneCategory.Office,
                    isPrimary: true,
                    value: values.phone
                }
            ],
            emails: [
                {
                    category: EmailCategory.Work,
                    isPrimary: true,
                    value: values.email
                }
            ],
            addresses: [],
            identifications: [
                {
                    category: IdentificationCategory.Tin,
                    isPrimary: true,
                    value: values.tinNumber
                }
            ],
            events: []
        }
        post(remoteRoutes.contacts, toSave,
            (data) => {
                Toast.info('Operation successful')
                actions.resetForm()
                dispatch({
                    type: crmConstants.crmAddContact,
                    payload: {...data},
                })
                if (done)
                    done()
            },
            undefined,
            () => {
                actions.setSubmitting(false);

            }
        )
    }

    return (
        <XForm
            onSubmit={handleSubmit}
            schema={schema}
            initialValues={data}
            onCancel={done}
        >
            <Grid spacing={1} container>
                <Grid item xs={8}>
                    <XTextInput
                        name="name"
                        label="Name"
                        type="text"
                        variant='outlined'
                    />
                </Grid>
                <Grid item xs={4}>
                    <XSelectInput
                        name="category"
                        label="Category"
                        options={toOptions(idCategories)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <XTextInput
                        name="name"
                        label="Name"
                        type="text"
                        variant='outlined'
                    />
                </Grid>
                <Grid item xs={6}>
                    <XTextInput
                        name="numberOfEmployees"
                        label="No. Employees"
                        type="number"
                        variant='outlined'
                    />
                </Grid>
                <Grid item xs={6}>
                    <XDateInput
                        name="dateOfPayment"
                        label="Date of Payment"
                        inputVariant='outlined'
                    />
                </Grid>
                <Grid item xs={12}>
                    <XTextInput
                        name="phone"
                        label="Phone"
                        type="text"
                        variant='outlined'
                    />
                </Grid>
                <Grid item xs={12}>
                    <XTextInput
                        name="email"
                        label="Email"
                        type="email"
                        variant='outlined'
                    />
                </Grid>
            </Grid>
        </XForm>
    );
}


export default NewCompanyForm;
