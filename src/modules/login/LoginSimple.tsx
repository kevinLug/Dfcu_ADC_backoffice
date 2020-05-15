import React, {useState} from 'react';
import {Button} from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import authService from "../../data/oidc/AuthService";
import {useLoginStyles} from "./loginStyles";

function Login() {
    const classes = useLoginStyles();
    const [loading,setLoading]=useState(false)
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
                <form className={classes.form}>
                    <Button
                        onClick={(event)=> {
                            event.preventDefault();
                            setLoading(true)
                            authService.login().finally(()=>{
                                setLoading(false)
                            })
                        }}
                        disabled={loading}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign in
                    </Button>
                </form>
            </Paper>
        </main>
    );
}

export default Login
