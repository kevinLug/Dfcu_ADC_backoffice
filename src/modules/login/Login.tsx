import React from 'react';
import {Button, makeStyles, Theme} from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {Form, Formik, FormikActions} from 'formik';
import {useDispatch} from 'react-redux'
import {handleLogin} from "../../data/coreActions";

import * as yup from "yup";
import createStyles from "@material-ui/core/styles/createStyles";
import {post} from "../../utils/ajax";
import {remoteRoutes} from "../../data/constants";
import Toast from "../../utils/Toast";
import XTextInput from "../../components/inputs/XTextInput";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        main: {
            width: 'auto',
            display: 'block', // Fix IE 11 issue.
            marginLeft: theme.spacing(3),
            marginRight: theme.spacing(3),
            [theme.breakpoints.up(400 + theme.spacing(3 * 2),)]: {
                width: 400,
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
        paper: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
        submit: {
            marginTop: theme.spacing(3),
        },
    }),
);

function Login() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const onSubmit = (data: any, actions: FormikActions<any>) => {
        post(remoteRoutes.login, data, resp => {
            dispatch(handleLogin(resp))
        }, () => {
            Toast.error("Invalid username/password")
        }, () => {
            actions.setSubmitting(false)
        })
    }

    return (
        <main className={classes.main}>
            <CssBaseline/>
            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockIcon/>
                </Avatar>
                <Typography component="h1">
                    Sign in
                </Typography>
                <Formik
                    initialValues={{
                        "email": "ekastimo@gmail.com",
                        "password": "Xpass@123"
                    }}
                    validationSchema={schema}
                    onSubmit={onSubmit}
                >
                    {(formState) => (
                        <Form className={classes.form}>
                            <XTextInput
                                type='email'
                                name='email'
                                label='Email Address'
                                autoComplete="email"
                                autoFocus
                                margin="normal"
                            />

                            <XTextInput
                                type='password'
                                name='password'
                                label='Password'
                                autoComplete="password"
                                margin="normal"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                disabled={formState.isSubmitting}
                            >
                                Sign in
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </main>
    );
}


export const schema = yup.object().shape(
    {
        email: yup.string().email('Invalid email').required("Email is required"),
        password: yup.string().required("Password is required")
    }
);

export default Login


