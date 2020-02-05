import React from 'react';
import {ActionStatus, IAction} from "../../types";
import Error from "./error";
import Pending from "./pending";
import Grid from "@material-ui/core/Grid";
import {printDateTime} from "../../../../utils/dateHelpers";
import DataValue from "../../../../components/DataValue";
import {ContactCategory, renderName, toTitleCase} from "../../../contacts/types";
import ContactLink from "../../../../components/links/ContactLink";
import {DateIcon, ErrorIcon, SuccessIcon} from "../../../../components/xicons";
import IconLabel from "../../../../components/IconLabel";

interface IProps {
    action: IAction
}


export enum IKycStatus {
    NotRun = 'NotRun', InProgress = 'InProgress', Passed = 'Passed', NotPassed = 'NotPassed', Error = '', Override = 'Error'
}

interface IKycResponse {
    id: string
    referenceId: string
    checkType: string
    checkStatus: IKycStatus
    value?: string
    comment?: string
    data: any
    runDate?: string
}


const hasError = (outData: string): boolean => {
    try {
        const data: IKycResponse = JSON.parse(outData);
        return !data.checkStatus
    } catch (e) {
        return true
    }
}

const KycCheck = ({action}: IProps) => {
    if (action.status === ActionStatus.Pending) {
        return <Pending text="Pending Execution"/>
    }
    const dataString = action.outputData
    if (action.status === ActionStatus.Error && hasError(dataString)) {
        return <Error action={action}/>
    }
    const data: IKycResponse = JSON.parse(dataString);
    const contact: any = JSON.parse(action.inputData);
    contact.category = ContactCategory.Person
    return (
        <Grid container>
            <Grid item xs={12} sm={6} md={4}>
                <DataValue><ContactLink id={contact.id} name={toTitleCase(renderName(contact))}/></DataValue>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <IconLabel icon={
                    data.checkStatus === IKycStatus.Passed ?
                        <SuccessIcon fontSize='inherit'/> :
                        <ErrorIcon fontSize='inherit'/>
                } label={`${data.checkStatus}/${data.value}`}/>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <IconLabel icon={<DateIcon fontSize='inherit'/>} label={printDateTime(data.runDate)}/>
            </Grid>
        </Grid>
    );
}


export default KycCheck;
