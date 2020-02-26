import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import GridWrapper from "../../components/GridWrapper";
import {useDispatch} from "react-redux";
import {handleLogin, handleLogout} from "../../data/redux/coreActions";
import authService from "../../data/oidc/AuthService";
import {User} from "oidc-client";

export default function Splash() {
    const dispatch = useDispatch()
    useEffect(() => {
        authService.getUser().then((user:User|null) => {
            if (user) {
                dispatch(handleLogin({user: user.profile, token: user.access_token}))
            } else {
                dispatch(handleLogout())
            }
        }).catch(error => {
            console.log("Auth error",error)
            dispatch(handleLogout())
        })
    },[dispatch])

    return <GridWrapper>
        <Grid container spacing={10} justify='center' alignItems="center">
            <Grid item>
                <CircularProgress/>
            </Grid>
        </Grid>
    </GridWrapper>
}
