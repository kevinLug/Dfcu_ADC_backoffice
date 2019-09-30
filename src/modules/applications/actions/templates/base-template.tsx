import React from 'react';
import {Grid} from "@material-ui/core";
import {ActionStatus, IAction} from "../../types";
import Error from "./error";
import Pending from "./pending";
import Typography from "@material-ui/core/Typography";
import RawData from "./RawData";

interface IProps {
    action: IAction
}

const BaseTemplate = ({action}: IProps) => {
    if (action.status === ActionStatus.Error) {
        return <Error text={action.statusMessage}/>
    }
    if (action.status === ActionStatus.Pending) {
        return <Pending text="Pending Execution"/>
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography>Something went down here</Typography>
            </Grid>
            <Grid item xs={12}>
                <RawData action={action}/>
            </Grid>
        </Grid>
    );
}
export default BaseTemplate;
