import React from 'react';
import {Grid} from "@material-ui/core";
import {ActionStatus, IAction} from "../../types";
import Error from "./error";
import Pending from "./pending";
import RawData from "./RawData";
import {printDateTime} from "../../../../utils/dateHelpers";
import DataLabel from "../../../../components/DataLabel";
import DataValue from "../../../../components/DataValue";

interface IProps {
    action: IAction
}

const BaseManualTemplate = ({action}: IProps) => {
    if (action.status === ActionStatus.Error) {
        return <Error action={action}/>
    }
    if (action.status === ActionStatus.Pending) {
        return <Pending text="Pending Execution"/>
    }
    const fields = [
        {
            label: 'Run Date',
            value: printDateTime(action.runDate)
        },
        {
            label: 'Status',
            value: action.status
        },
        {
            label: 'Description',
            value: action.description
        }
    ]
    return (
        <Grid container spacing={2}>
            {
                fields.map(it => (
                    <Grid item xs={12} sm={6} md={3} key={it.label}>
                        <DataLabel >
                            {it.label}
                        </DataLabel>
                        <DataValue>{it.value}</DataValue>
                    </Grid>
                ))
            }
            <Grid item xs={12}>
                <RawData action={action}/>
            </Grid>
        </Grid>
    );
}
export default BaseManualTemplate;
