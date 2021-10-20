import {BaseModel} from "../../data/types";

export interface IWorkflowInclude {
    caseData?: boolean;
    tasks?: boolean;
    documents?: boolean;
}

export interface IWorkflowFilter {
    id?: string;
    referenceNumber?: string;
    externalReference?: string;
    userId?: string;
    //applicant?: string;
    assignee?: string;
    showNew?: boolean;
    showAssigned?: boolean;
    product?: string;
    idNumber?: string;
    statuses?: string[];
    from?: Date | null;
    to?: Date | null;
    subStatuses?: string[];
    workflowTypes?: string[];
    include?: IWorkflowInclude;

    applicantName?: string
    beneficiaryName?: string;
    branchName?: string;
    branchCode?: string;

}

export interface IWorkflowFilterResult {
    id?: string;
    referenceNumber?: string;
    externalReference?: string;
    userId?: string;
    applicant?: string;
    assignee?: string;
    statuses?: string[];
    from?: Date | null;
    to?: Date | null;
    subStatuses?: string[];
    workflowTypes?: string[];
    include?: IWorkflowInclude;

    applicantName?: string
}

export interface IAction extends BaseModel {
    name: string;
    type: string;
    parameterType: string;
    service: string;
    endPoint: string;
    template?: string;
    errorTemplate?: string | null;
    title: string;
    description: string;
    roles: string[];
    shouldRender: boolean;
    nextStatusError: string;
    nextStatusSuccess: string;

    optional: boolean;
    ignored: boolean;
    skipped: boolean;

    status: ActionStatus;
    statusMessage: string;
    runDate: Date;
    inputData: string;
    outputData: string;
    notifications: any[];
}

export interface ITask extends BaseModel {
    name: string;
    workflowId: string;
    title: string;
    description: string;
    status: TaskStatus;
    statusMessage: string;
    runDate: Date;
    actions: IAction[];
}

export interface IWorkflow extends BaseModel {
    type: string;
    name: string;
    title: string;
    description: string;

    applicationDate: Date;
    userId: string;
    externalReference: string;
    referenceNumber: string;

    status: WorkflowStatus;
    subStatus: WorkflowSubStatus;
    subStatusComment: string;
    runDate?: Date;

    tasks: ITask[];
    documents: IDocument[];
    caseData: any;
    metaData: any;

    assigneeId?: string;
    assignedDate?: string;
}

export const determineWorkflowStatus = (status: string | number) => {
    if (typeof (status) === "number") {
        switch (status) {
            case 0:
                return WorkflowStatus.Open;
            case 1:
                return WorkflowStatus.Closed;
            default:
                return WorkflowStatus.Error;
        }
    }
    return status
}

export enum WorkflowStatus {
    Open = "Open",
    Error = "Error",
    Closed = "Closed",
    Cleared = "Cleared",
    New = "New",
    Pending = "Pending",
    Rejected = "Rejected",
    //PendingApproval = 'Pending Approval',
    Approved = 'Approved' // PendingClearance
}

export enum OpenWorkflowStatusRepresentation {
    Pending = "Pending",
    PendingClearance = 'Approved',
    New = "New",
}

export enum PendingWorkflowStatusRepresentation {

}

export enum WorkflowSubStatus {
    UnknownError = "UnknownError",
    OperationSucceeded = "OperationSucceeded",

    Pending = "Pending",
    TransactionComplete = "TransactionComplete",
    ManualVerification = "ManualVerification",

    AwaitingCSOApproval = 'AwaitingCSOApproval',
    AwaitingSubmissionToFinacle = 'AwaitingSubmissionToFinacle',
    AwaitingCheckerApproval = 'AwaitingCheckerApproval',
    AwaitingBMApproval = 'AwaitingBMApproval',
    AwaitingClearingDeptApproval = 'AwaitingClearingDeptApproval',

    FailedCSOApproval = 'FailedCSOApproval',
    FailedBMApproval = 'FailedBMApproval',
    FailedCheckerApproval = 'FailedCheckerApproval',
    SendingToFinacleFailed = 'SendingToFinacleFailed',
    FailedCMOApproval = 'FailedCMOApproval',
    SentToFinacle = 'SentToFinacle',
    FailedClearingDeptApproval = ' FailedClearingDeptApproval',


    ContactCreationFailed = "ContactCreationFailed",
    CaseUpdateFailed = "CaseUpdateFailed",

    RegulationCheckFailed = "RegulationCheckFailed",
    InternalWatchlistFailed = "InternalWatchlistFailed",
    RiskProfileFailed = "RiskProfileFailed",

    InReview = "InReview",

    AwaitingDocumentsApproval = "AwaitingDocumentsApproval",
    DocumentsValidationFailed = "DocumentsValidationFailed",

    AwaitingAccountApproval = "AwaitingAccountApproval",
    AccountVerificationFailed = "AccountVerificationFailed",

    AwaitingSignatureUpload = "AwaitingSignatureUpload",
    SignatureRejected = "SignatureRejected",

    AwaitingCaseClosure = "AwaitingCaseClosure",
    FailedToCloseCase = "FailedToCloseCase",
}

export enum ActionStatus {
    Pending = "Pending",
    Done = "Done",
    Error = "Error",
}

export enum TaskStatus {
    Pending = "Pending",
    Done = "Done",
    Error = "Error",
}

export enum DocumentType {
    Image = "Image",
    Pdf = "Pdf",
}

export interface IDocument {
    id: string;
    name: string;
    fileName: string;
    contentType: string;
    sizeInMbs: number;
}

export interface IManualDecision {
    caseId: string;
    taskName: string;
    actionName: string;

    resumeCase: boolean;
    override: boolean;
    nextSubStatus: string;
    data: any;
}

export const canRunAction = (actionName: string, taskName: string, workflow: IWorkflow) => {
    const taskIndex = workflow.tasks.findIndex((it) => it.name === taskName);
    const taskReady = taskIndex === 0 || workflow.tasks[taskIndex - 1].status === TaskStatus.Done;
    if (!taskReady) {
        // Some tasks before this action are not yet complete
        return false;
    }
    const task = workflow.tasks[taskIndex];
    const actionIndex = task.actions.findIndex((it) => it.name === actionName);
    return actionIndex === 0 || task.actions[actionIndex - 1].status === ActionStatus.Done;
};

export const printActionStatus = (status: WorkflowStatus) => {
    return status;
};

export const printTaskStatus = (status: WorkflowStatus) => {
    return status;
};

export const trimCaseId = (data: string) => {
    return data.substr(0, 8);
};
