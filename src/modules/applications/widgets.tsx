import React from "react";
import {WorkflowStatus, WorkflowSubStatus} from "./types";
import {ErrorLabel, SuccessLabel, WarnLabel} from "../../components/widgets";
import {camelPad} from "../../utils/stringHelpers";

export const printWorkflowStatus = (status: WorkflowStatus) => {
    switch (status) {
        case WorkflowStatus.Closed:
            return <SuccessLabel>{status}</SuccessLabel>
        case WorkflowStatus.Open:
            return <WarnLabel>{status}</WarnLabel>
        case WorkflowStatus.Error:
            return <ErrorLabel>{status}</ErrorLabel>
    }
}

export const printWorkflowSubStatus = (status: WorkflowSubStatus, row?: any) => {
    switch (status) {
        case WorkflowSubStatus.Verified:
            return <SuccessLabel>{camelPad(status)}</SuccessLabel>
        case WorkflowSubStatus.KycCheckFailed:
        case WorkflowSubStatus.RiskProfileFailed:
        case WorkflowSubStatus.UnknownError:
            return <ErrorLabel>{camelPad(status)}</ErrorLabel>
        case WorkflowSubStatus.Pending:
        case WorkflowSubStatus.ManualVerification:
            return <WarnLabel>{camelPad(status)}</WarnLabel>
        default:
            return <ErrorLabel>{camelPad(status)}</ErrorLabel>
    }
}

