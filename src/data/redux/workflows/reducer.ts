import {IDocument, IWorkflow} from "../../../modules/workflows/types";
import {get} from "../../../utils/ajax";
import {remoteRoutes} from "../../constants";
import {Dispatch} from "redux";

export const workflowConstants = {
    workflowsStartFetch: "workflowsStartFetch",
    workflowsStopFetch: "workflowsStopFetch",
    workflowsCommitFetch: "workflowsCommitFetch",
    workflowsUpdateDocs: "workflowsUpdateDocs",
}

export interface IWorkflowState {
    loading: boolean
    workflow?: IWorkflow
}

const initialState: IWorkflowState = {
    workflow: undefined,
    loading: false
}

export default function reducer(state = initialState, action: any) {
    switch (action.type) {

        case workflowConstants.workflowsStartFetch: {
            return {...state, loading: true}
        }
        case workflowConstants.workflowsStopFetch: {
            return {...state, loading: false}
        }

        case workflowConstants.workflowsCommitFetch: {
            const workflow: IWorkflow = action.payload
            return {...state, workflow, loading: true}
        }

        case workflowConstants.workflowsUpdateDocs: {
            const document: IDocument = action.payload
            if (state.workflow) {
                const documents = [...state.workflow.documents, document]
                const workflow = {...state.workflow, documents}
                return {...state, workflow}
            }
            return state
        }

        default: {
            return state
        }
    }
}


export function updateWorkflowDocs(document: IDocument) {
    return {
        type: workflowConstants.workflowsUpdateDocs,
        payload: document
    }
}

export function startWorkflowFetch() {
    return {type: workflowConstants.workflowsStartFetch}
}

export function fetchWorkflowAsync(caseId: string) {
    const url = `${remoteRoutes.workflows}/${caseId}`
    return (dispatch: Dispatch<any>) => {
        get(
            url,
            resp => dispatch({type: workflowConstants.workflowsCommitFetch, payload: resp}),
            undefined,
            () => dispatch({type: workflowConstants.workflowsStopFetch})
        )
    };
}
