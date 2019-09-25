import React from 'react';
import {Grid} from "@material-ui/core";
import IBox from "../../../../components/ibox/IBox";
import {ActionStatus, IAction} from "../../types";
import Error from "./error";
import Pending from "./pending";
import {prettyJson} from "../../../../utils/jsonHelpers";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

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
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography>Input</Typography>
                        <Divider/>
                        <pre>
                            {prettyJson(action.inputData)}
                        </pre>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography>Output</Typography>
                        <Divider/>
                        <pre>
                            {prettyJson(action.inputData)}
                        </pre>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
export default BaseTemplate;
