import {
    IWorkflowResponseMessage, IWorkflowResponseMessageDefault
} from "../../../modules/transfers/types";

export const workflowResponseConstants = {
    getWorkflowResponseMessage: "WORKFLOW_RESPONSE_MESSAGE"
}

export interface IWorkflowResponseMessageState {
    workflowResponseMessage: IWorkflowResponseMessage
}


export const initialState: IWorkflowResponseMessageState = {
    workflowResponseMessage: IWorkflowResponseMessageDefault
}

export const actionIWorkflowResponseMessage = (workflowResponseMessage: IWorkflowResponseMessage) => {
    return {
        type: workflowResponseConstants.getWorkflowResponseMessage,
        payload: workflowResponseMessage
    }
}

export const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case workflowResponseConstants.getWorkflowResponseMessage:
            return {
                ...state, workflowResponseMessage: action.payload
            }
        default: {
            return state
        }
    }
}