import React from 'react';
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";
import GridWrapper from "../../../../components/GridWrapper";
import {errorColor} from "../../../../theme/custom-colors";

interface IProps {
    text: any
}

const Error = (props: IProps) => {
    return (
        <GridWrapper>
            <Grid container spacing={10} justify='flex-start' alignItems="flex-start">
                <Grid item>
                    <Typography style={{color: errorColor}} variant='body1'>{props.text}</Typography>
                </Grid>
            </Grid>
        </GridWrapper>
    );
}
export default Error;
