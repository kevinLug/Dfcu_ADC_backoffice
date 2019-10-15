import React from "react";
import {Form, Formik, FormikActions} from 'formik';

import {Grid} from "@material-ui/core";
import Button from "@material-ui/core/Button";

interface IProps {
    schema?: any
    onSubmit: (values: any, actions: FormikActions<any>) => any
    onCancel?: () => any
    debug?: boolean
    children?: React.ReactNode
    initialValues?: any
}

const XForm = (props: IProps) => {
    return <>
        <Formik
            initialValues={props.initialValues}
            onSubmit={props.onSubmit}
            validationSchema={props.schema}
            validateOnBlur
            render={({submitForm, isSubmitting, values, errors}) => (
                <Form>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            {props.children}
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={1} alignContent='flex-end' justify='flex-end'>
                                {
                                    props.onCancel &&
                                    <Grid item>
                                        <Button variant='contained' color='primary' onClick={props.onCancel}
                                                disabled={isSubmitting}>Cancel</Button>
                                    </Grid>
                                }
                                <Grid item>
                                    <Button variant='contained' color='primary' onClick={submitForm}
                                            disabled={isSubmitting}>Submit</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        {
                            props.debug &&
                            <Grid item xs={12}>
                                <pre style={{width: '100%', height: "100%"}}>
                                    {JSON.stringify({values, errors}, null, 2)}
                                </pre>
                            </Grid>
                        }
                    </Grid>
                </Form>
            )}
        />
    </>
}

export default XForm
