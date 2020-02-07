import {IAction, IWorkflow} from "../../types";


export default interface  ITemplateProps {
    action: IAction
    workflowId: string
    taskName: string
    workflow?: IWorkflow
}
