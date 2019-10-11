import * as React from "react";
import Navigation from "../../components/Layout";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import XTextInput from "../../components/inputs/XTextInput";
import {Form, Formik, FormikActions} from 'formik';
import XSelectInput from "../../components/inputs/XSelectInput";
import XCheckBoxInput from "../../components/inputs/XCheckBoxInput";
import XRadioInput from "../../components/inputs/XRadioInput";
import XDateInput from "../../components/inputs/XDateInput";
import * as yup from 'yup';
import {nullableString, reqDate, reqString} from "../../data/validations";
import {
    civilStatusCategories,
    genderCategories,
    hobbyCategories,
    salutationCategories
} from "../../data/comboCategories";
import {toOptions} from "../../components/inputs/inputHelpers";
import XTextAreaInput from "../../components/inputs/XTextAreaInput";

const Settings = () => {
    function handleSubmission(values: any, actions: FormikActions<any>) {
        setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
        }, 1000);
    }

    const schema = yup.object().shape(
        {
            gender: reqString.oneOf(genderCategories),
            firstName: reqString,
            lastName: reqString,
            hobbies: reqString,
            birthDate: reqDate,
            salutation: nullableString.oneOf(salutationCategories),
            middleName: nullableString,
            civilStatus: nullableString.oneOf(civilStatusCategories),
            about: reqString,
            avatar: nullableString
        }
    )
    return <Navigation>
        <Formik
            initialValues={{hobbies2: [], hobbies: "", accept: false, gender: ""}}
            onSubmit={handleSubmission}
            validationSchema={schema}
            validateOnBlur
            render={({ submitForm, isSubmitting, values,errors }) => (
                <Form>
                    <Grid spacing={2} container>
                        <Grid item sm={4}>
                            <XTextInput
                                name="firstName"
                                label="First Name"
                                type="text"
                            />
                        </Grid>
                        <Grid item sm={4}>
                            <XTextInput
                                name="lastName"
                                label="Last Name"
                                type="text"
                            />
                        </Grid>
                        <Grid item sm={4}>
                            <XTextInput
                                name="email"
                                label="Email"
                                type="email"
                            />
                        </Grid>
                        <Grid item sm={4}>
                            <XSelectInput
                                name="hobbies"
                                label="Hobbies"
                                options={toOptions(hobbyCategories)}
                            />
                        </Grid>
                        <Grid item sm={4}>
                            <XSelectInput
                                name="hobbies2"
                                label="Hobbies2"
                                multiple={true}
                                options={toOptions(hobbyCategories)}
                            />
                        </Grid>
                        <Grid item sm={4}>
                            <XTextAreaInput
                                name="about"
                                label="About Me"
                                rowsMax={4}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <XCheckBoxInput
                                name="accept"
                                label="Accept Terms"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <XRadioInput
                                name="gender"
                                label="Gender"
                                options={toOptions(genderCategories)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <XDateInput
                                name="birthDate"
                                label="Birth Date"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button onClick={submitForm}>Submit</Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <pre>
                                {JSON.stringify(values, null, 2)}
                            </pre>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <pre>
                                {JSON.stringify(errors, null, 2)}
                            </pre>
                        </Grid>
                    </Grid>
                </Form>
            )}
        />

    </Navigation>
}

export default Settings
