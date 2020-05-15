import React, {Fragment} from "react";
import {ITask, TaskStatus} from "../types";
import Typography from "@material-ui/core/Typography";
import {printDateTime} from "../../../utils/dateHelpers";
import {ErrorIcon, SuccessIcon, WarningIcon} from "../../../components/xicons";

interface IProps {
    data: ITask
}

export default function TaskStatusView({data}: IProps) {
    const {status, actions} = data
    let actionNames = actions.map(it => it.name).join("\n")

    if (status === TaskStatus.Done) {
        return <Fragment>
            <Typography
                variant='body1'
                style={{marginTop: 1}}>
                &nbsp;
                <SuccessIcon
                    fontSize='inherit'
                />
            </Typography>
            <Typography variant='body1' title={actionNames}>
                &nbsp;Completed Task
            </Typography>
        </Fragment>
    } else if (status === TaskStatus.Error) {
        return <Fragment>
            <Typography
                variant='body1'
                style={{marginTop: 1}}>
                &nbsp;
                <ErrorIcon
                    fontSize='inherit'
                />
            </Typography>
            <Typography variant='body1'>
                &nbsp;Error on&nbsp;
            </Typography>
            <Typography variant='body1'>
                {printDateTime(data.runDate)}
            </Typography>
        </Fragment>
    } else {
        return <Fragment>
            <Typography
                variant='body1'
                style={{marginTop: 1}}>
                &nbsp;
                <WarningIcon
                    fontSize='inherit'
                />
            </Typography>
            <Typography variant='body1'>
                &nbsp;Pending
            </Typography>
        </Fragment>
    }

}
