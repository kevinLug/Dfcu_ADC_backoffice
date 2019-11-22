import React from 'react';
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";
import {errorColor} from "../../../../theme/custom-colors";
import RawData from "./RawData";
import {IAction} from "../../types";

interface IProps {
    action: IAction
}

const Error = (props: IProps) => {
    return (
        <Grid container spacing={1} justify='flex-start' alignItems="flex-start">
            <Grid item>
                <Typography style={{color: errorColor}} variant='body1'>{props.action.statusMessage}</Typography>
            </Grid>
            <Grid item xs={12}>
                <RawData action={props.action}/>
            </Grid>
        </Grid>
    );
}
export default Error;
