import React from 'react';
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {IWorkflow} from "../types";

interface IProps {
    data:IWorkflow
}

const Summary = (props: IProps) => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography>Summary here</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>Summary here</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>Summary here</Typography>
            </Grid>
        </Grid>
    );
}


export default Summary;
