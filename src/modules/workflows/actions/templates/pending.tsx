import React from 'react';
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";
import {warningColor} from "../../../../theme/custom-colors";

interface IProps {
    text: any
}

const Pending = (props: IProps) => {
    return (
        <Grid container spacing={0} justify='flex-start' alignItems="flex-start">
            <Grid item>
                <Typography style={{color: warningColor}} variant='body1'>{props.text}</Typography>
            </Grid>
        </Grid>
    );
}
export default Pending;
