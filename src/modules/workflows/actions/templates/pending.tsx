import React from 'react';
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";
import GridWrapper from "../../../../components/GridWrapper";
import {warningColor} from "../../../../theme/custom-colors";

interface IProps {
    text: any
}

const Pending = (props: IProps) => {
    return (
        <GridWrapper>
            <Grid container spacing={10} justify='flex-start' alignItems="flex-start">
                <Grid item>
                    <Typography style={{color: warningColor}} variant='body1'>{props.text}</Typography>
                </Grid>
            </Grid>
        </GridWrapper>
    );
}
export default Pending;
