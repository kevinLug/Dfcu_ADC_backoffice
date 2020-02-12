import React from 'react';
import * as yup from "yup";
import {reqString} from "../../../../data/validations";
import {FormikActions} from "formik";
import Grid from "@material-ui/core/Grid";
import XForm from "../../../../components/forms/XForm";
import XTextInput from "../../../../components/inputs/XTextInput";
import {IContactTag} from "../../types";
import {remoteRoutes} from "../../../../data/constants";
import {useDispatch} from 'react-redux'

import {handleSubmission, ISubmission} from "../../../../utils/formHelpers";
import {crmConstants} from "../../../../data/redux/contacts/reducer";

interface IProps {
    contactId: string
    data: IContactTag | null
    isNew: boolean
    done?: () => any
}

const schema = yup.object().shape(
    {
        value: reqString
    }
)

const TagEditor = ({data, isNew, contactId, done}: IProps) => {
    const dispatch = useDispatch();

    function handleSubmit(values: any, actions: FormikActions<any>) {
        const submission: ISubmission = {
            url: remoteRoutes.contactsTag,
            values:{...values,contactId}, actions, isNew,
            onAjaxComplete: (data: any) => {
                dispatch({
                    type: isNew ? crmConstants.crmAddTag : crmConstants.crmEditTag,
                    payload: {...data},
                })
                if (done)
                    done()
            }
        }
        handleSubmission(submission)
    }
    return (
        <XForm
            onSubmit={handleSubmit}
            schema={schema}
            initialValues={data}
        >
            <Grid spacing={0} container>
                <Grid item xs={12}>
                    <XTextInput
                        name="value"
                        label="Tag"
                        type="text"
                        variant='outlined'
                    />
                </Grid>
            </Grid>
        </XForm>
    );
}

export default TagEditor;
