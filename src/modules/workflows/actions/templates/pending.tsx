import React from 'react';
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';

interface IProps {
    text: any
}

const Pending = (props: IProps) => {
    return (
        <Grid container spacing={0} justify='flex-start' alignItems="flex-start">
            <Grid item xs={12}>
                <Alert severity="warning">
                    <Typography >{props.text}</Typography>
                </Alert>
            </Grid>
        </Grid>
    );
}
export default Pending;
