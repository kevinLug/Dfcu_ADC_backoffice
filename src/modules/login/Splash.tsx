import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import GridWrapper from "../../components/GridWrapper";
import userManager from "../../data/auth/userManager";


export default function Splash() {
    // const dispatch = useDispatch()
    // useEffect(() => {
    //     get(remoteRoutes.profile,
    //         data => {
    //             dispatch(handleLogin({user: data, token: getToken()}))
    //         }, (err) => {
    //             console.log("Profile loading failed", err)
    //             dispatch(handleLogout())
    //         }, () => {
    //             console.log("End callback")
    //         }
    //     )
    // },[dispatch])

 
    return <GridWrapper>
        <Grid container spacing={10} justify='center' alignItems="center">
            <Grid item>
                <CircularProgress/>
            </Grid>
        </Grid>
    </GridWrapper>
}
