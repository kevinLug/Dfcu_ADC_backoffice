import React from 'react';
import Grid from "@material-ui/core/Grid";
import RawData from "./RawData";
import {IAction} from "../../types";
import Alert from '@material-ui/lab/Alert';
import {Typography} from "@material-ui/core";

interface IProps {
    action: IAction
}

const Error = (props: IProps) => {
    return (
        <Grid container spacing={1} justify='flex-start' alignItems="flex-start">
            <Grid item xs={12}>
                <Alert severity="error"><Typography >{props.action.statusMessage}</Typography></Alert>
            </Grid>
            <Grid item xs={12}>
                <RawData action={props.action}/>
            </Grid>
        </Grid>
    );
}
export default Error;
