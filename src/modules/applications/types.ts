import {BaseModel} from "../../data/types";

export interface IAction extends BaseModel {
    name: string,
    template?: string,
    title: string
    description: string
    roles: string[]

    nextStatusError: string
    nextStatusSuccess: string

    optional: boolean
    ignored: boolean
    skipped: boolean

    status: ActionStatus
    statusMessage: string
    runDate: Date
    inputData: string
    outputData: string
    notifications: any[]
}

export interface ITask extends BaseModel {
    name: string,
    title: string
    description: string
    status: TaskStatus
    statusMessage: string
    runDate: Date
    actions: IAction[]
}

export interface IWorkflow extends BaseModel {
    type: string,
    name: string,
    title: string
    description: string

    applicationDate: Date
    userId: string
    externalReference: string
    referenceNumber: string

    status: WorkflowStatus
    subStatus: WorkflowSubStatus
    subStatusComment: string
    runDate?: Date

    tasks: ITask[]
    caseData: any
    metaData: any

    assigneeId?: string
    assignedDate?: string
}

export enum WorkflowStatus {
    Open = 'Open',
    Error = 'Error',
    Closed = 'Closed'
}

export enum WorkflowSubStatus {
    Pending = 'Pending',
    UnknownError = 'UnknownError',
    Verified = 'Verified',
    ManualVerification = 'ManualVerification',
    KycCheckFailed = 'KycCheckFailed',
    RiskProfileFailed = 'RiskProfileFailed',
}

export enum ActionStatus {
    Pending = 'Pending',
    Done = 'Done',
    Error = 'Error'
}

export enum TaskStatus {
    Pending = 'Pending',
    Done = 'Done',
    Error = 'Error'
}

export const printActionStatus = (status: WorkflowStatus) => {
    return status;
}

export const printTaskStatus = (status: WorkflowStatus) => {
    return status;
}

export const trimCaseId = (data: string) => {
    return data.substr(0, 8)
}
