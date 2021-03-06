import React from "react";
import {ITask, TaskStatus, WorkflowStatus, WorkflowSubStatus} from "./types";
import {ErrorIcon, SuccessIcon, WarningIcon} from "../../components/xicons";
import {errorColor, successColor, warningColor} from "../../theme/custom-colors";
import {Chip} from "@material-ui/core";


export const renderStatus = (value: WorkflowStatus) => {
    let color = successColor
    switch (value) {
        case WorkflowStatus.Closed:
            color = successColor
            break
        case WorkflowStatus.Cleared:
            color = successColor
            break
        case WorkflowStatus.Error:
            color = errorColor
            break
        case WorkflowStatus.Rejected:
            color = errorColor
            break
        case WorkflowStatus.Open:
            color = warningColor
            break
        case WorkflowStatus.New:
            color = warningColor
            break
        // case WorkflowStatus.PendingApproval:
        //     color = warningColor
        //     break
        case WorkflowStatus.Approved:
            color = successColor
            break
        case WorkflowStatus.Pending:
            color = warningColor
    }

    return <Chip
        color='primary'
        variant='default'
        size='small'
        label={value}
        style={{padding: 0, height: 18, backgroundColor: color, marginBottom: 2}}
    />
}


export const renderSubStatus = (value: WorkflowSubStatus) => {
    let color = successColor
    switch (value) {
        case WorkflowSubStatus.TransactionComplete:
            color = successColor
            break
        case WorkflowSubStatus.UnknownError:
        case WorkflowSubStatus.CaseUpdateFailed:
        case WorkflowSubStatus.ContactCreationFailed:

        case WorkflowSubStatus.RiskProfileFailed:
        case WorkflowSubStatus.InternalWatchlistFailed:
        case WorkflowSubStatus.RegulationCheckFailed:

        // case WorkflowSubStatus.CifCreationFailed:
        // case WorkflowSubStatus.AccountCreationFailed:


        case WorkflowSubStatus.DocumentsValidationFailed:
        case WorkflowSubStatus.AccountVerificationFailed:
        case WorkflowSubStatus.SignatureRejected:
        case WorkflowSubStatus.FailedToCloseCase:
            color = errorColor
            break
        case WorkflowSubStatus.ManualVerification:
        case WorkflowSubStatus.Pending:
        case WorkflowSubStatus.AwaitingAccountApproval:
        case WorkflowSubStatus.AwaitingCaseClosure:
        case WorkflowSubStatus.AwaitingDocumentsApproval:
        case WorkflowSubStatus.AwaitingSignatureUpload:
        case WorkflowSubStatus.AwaitingCSOApproval:
        case WorkflowSubStatus.AwaitingCheckerApproval:
        case WorkflowSubStatus.AwaitingBMApproval:
        case WorkflowSubStatus.AwaitingClearingDeptApproval:
        case WorkflowSubStatus.AwaitingSubmissionToFinacle:
            color = warningColor
            break
        default:
            color = errorColor
    }

    return <Chip
        color='primary'
        variant='default'
        size='small'
        label={value}
        style={{padding: 0, height: 18, backgroundColor: color, marginBottom: 2}}
    />
}


export function printTaskIcon(task: ITask): any {
    switch (task.status) {
        case TaskStatus.Done:
            return SuccessIcon
        case TaskStatus.Error:
            return ErrorIcon
        case TaskStatus.Pending:
            return WarningIcon
    }
}

