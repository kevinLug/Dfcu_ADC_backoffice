import React from 'react';
import {IColumn} from "./types";
import {FormikHelpers} from "formik/dist/types";
import {handleSubmission, ISubmission} from "../../utils/formHelpers";
import XForm from "../forms/XForm";
import Grid from "@material-ui/core/Grid";
import {renderInput} from "../inputs/inputHelpers";

interface IProps {
    columns: IColumn[]
    url: string
    data: any | null
    isNew: boolean
    debug?: boolean
    done?: () => any
    onNew: (data: any) => any
    onEdited: (data: any) => any
    schema?: any
}

const EditForm = ({data, isNew, url, columns, done,debug, ...props}: IProps) => {

    function handleSubmit(values: any, actions: FormikHelpers<any>) {
        const submission: ISubmission = {
            url, values, actions, isNew,
            onAjaxComplete: (data: any) => {
                isNew ? props.onNew(data) : props.onEdited(data);
                if (done)
                    done()
            }
        }
        handleSubmission(submission)
    }

    return (
        <XForm
            onSubmit={handleSubmit}
            schema={props.schema}
            initialValues={data}
            debug={debug}
        >
            <Grid spacing={0} container>
                {
                    columns.map(it => {
                        return <Grid item xs={12} key={it.name}>
                            {renderInput(it)}
                        </Grid>
                    })
                }
            </Grid>
        </XForm>
    );
}

export default EditForm;
