import * as React from "react";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import XTextInput from "../../components/inputs/XTextInput";
import {Form, Formik, FormikActions} from 'formik';
import XSelectInput from "../../components/inputs/XSelectInput";
import {toOptions} from "../../components/inputs/inputHelpers";

const Filter = () => {
    function handleSubmission(values: any, actions: FormikActions<any>) {
        setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
        }, 1000);
    }

    return <Formik
        initialValues={{name: '', contactType: '', email: '', phone: '', nin: ''}}
        onSubmit={handleSubmission}
        validateOnBlur
        render={({submitForm, isSubmitting}) => (
            <Form>
                <Grid spacing={2} container>
                    <Grid item xs={12}>
                        <XTextInput
                            name="name"
                            label="Name"
                            type="text"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <XSelectInput
                            name="contactType"
                            label="Contact Type"
                            options={toOptions(['Company', 'Person'])}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <XTextInput
                            name="email"
                            label="Email"
                            type="email"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <XTextInput
                            name="phone"
                            label="Phone"
                            type="text"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <XTextInput
                            name="nin"
                            label="NIN"
                            type="text"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            disabled={isSubmitting}
                            variant="contained"
                            fullWidth
                            onClick={submitForm}><DeleteIcon/>&nbsp;Clear</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            disabled={isSubmitting}
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={submitForm}>Apply</Button>
                    </Grid>
                </Grid>
            </Form>
        )}
    />
}

export default Filter
