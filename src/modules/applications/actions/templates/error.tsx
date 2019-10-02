import React from 'react';
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";
import GridWrapper from "../../../../components/GridWrapper";
import {errorColor} from "../../../../theme/custom-colors";
import RawData from "./RawData";
import {IAction} from "../../types";

interface IProps {
    action: IAction
}

const Error = (props: IProps) => {
    return (
        <GridWrapper>
            <Grid container spacing={10} justify='flex-start' alignItems="flex-start">
                <Grid item>
                    <Typography style={{color: errorColor}} variant='body1'>{props.action.statusMessage}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <RawData action={props.action}/>
                </Grid>
            </Grid>
        </GridWrapper>
    );
}
export default Error;
