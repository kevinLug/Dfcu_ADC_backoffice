import * as React from "react";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import XTextInput from "../../components/inputs/XTextInput";
import {Form, Formik, FormikActions} from 'formik';
import XSelectInput from "../../components/inputs/XSelectInput";
import {toOptions} from "../../components/inputs/inputHelpers";
import {enumToArray} from "../../utils/stringHelpers";
import {IWorkflowFilter, WorkflowStatus, WorkflowSubStatus} from "./types";
import XDateInput from "../../components/inputs/XTimeInput";


interface IProps {
    onFilter: (data: IWorkflowFilter, callBack: () => any) => any
}

const Filter = (props: IProps) => {
    function handleSubmission(values: any, actions: FormikActions<any>) {
        props.onFilter(
            values,
            () => {
                actions.setSubmitting(false);
            }
        );
    }

    return <Formik
        initialValues={{name: '', contactType: '', email: '', phone: '', nin: ''}}
        onSubmit={handleSubmission}
        render={({submitForm, isSubmitting}) => (
            <Form>
                <Grid spacing={2} container>
                    <Grid item xs={6}>
                        <XDateInput
                            name="from"
                            label="From"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <XDateInput
                            name="to"
                            label="To"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <XSelectInput
                            name="status"
                            label="Status"
                            options={toOptions(enumToArray(WorkflowStatus))}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <XSelectInput
                            name="subStatus"
                            label="Sub Status"
                            options={toOptions(enumToArray(WorkflowSubStatus))}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <XSelectInput
                            name="type"
                            label="Case Type"
                            options={toOptions(['USSD-LOAN', 'ON-BOARD'])}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <XTextInput
                            name="applicant"
                            label="Applicant"
                            type="text"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <XTextInput
                            name="user"
                            label="User"
                            type="text"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <XTextInput
                            name="assignee"
                            label="Assignee"
                            type="text"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            disabled={isSubmitting}
                            variant="contained"
                            fullWidth
                            onClick={submitForm}>Clear</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            disabled={isSubmitting}
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={submitForm}>Apply Filter</Button>
                    </Grid>
                </Grid>
            </Form>
        )}
    />
}

export default Filter
