import React, {Fragment} from "react";
import {ActionStatus, IAction} from "../types";
import Typography from "@material-ui/core/Typography";
import {printDateTime} from "../../../utils/dateHelpers";
import {ErrorIcon, SuccessIcon, WarningIcon} from "../../../components/xicons";

interface IProps {
    data: IAction
}
export default function ActionStatusView({data}: IProps) {
    const {status} = data
    if (status === ActionStatus.Done) {
        return <Fragment>
            <Typography
                variant='body2'
                style={{marginTop: 1}}>
                &nbsp;
                <SuccessIcon
                    fontSize='inherit'
                />
            </Typography>
            <Typography variant='body2'>
                &nbsp;Last ran on&nbsp;
            </Typography>
            <Typography variant='body2'>
                {printDateTime(data.runDate)}
            </Typography>
        </Fragment>
    } else if (status === ActionStatus.Error) {
        return <Fragment>
            <Typography
                variant='body2'
                style={{marginTop: 1}}>
                &nbsp;
                <ErrorIcon
                    fontSize='inherit'
                />
            </Typography>
            <Typography variant='body2'>
                &nbsp;Error on&nbsp;
            </Typography>
            <Typography variant='body2'>
                {printDateTime(data.runDate)}
            </Typography>
        </Fragment>
    } else {
        return <Fragment>
            <Typography
                variant='body2'
                style={{marginTop: 1}}>
                &nbsp;
                <WarningIcon
                    fontSize='inherit'
                />
            </Typography>
            <Typography variant='body2'>
                &nbsp;Pending
            </Typography>
        </Fragment>
    }

}
