import {IKeyValueMap} from "../../utils/collections/map";
import {IManualDecision} from "../workflows/types";
import {isNullOrEmpty, isObject} from "../../utils/objectHelpers";
import {IList} from "../../utils/collections/list";

export const populateLabelAndValue = (exceptions: string[] = [], pairs: IKeyValueMap<string, any>, valuePlaceHolder: any) => {

    exceptions.forEach(e => pairs.remove(e))

    pairs.keyValueMapToArray().map((kv) => {
        if (!kv.value)
            return pairs.replace(kv.key, valuePlaceHolder)
    })

    return pairs.keyValueMapToArray();
}

export const populateValue = (exceptions: string[] = [], list: IList<string>, valuePlaceHolder: any) => {

    exceptions.forEach(e => list.remove(e))

    // list.toArray().map((kv) => {
    //     if (!kv.value)
    //         return pairs.replace(kv.key, valuePlaceHolder)
    // })

    return list.toArray();
}

export const getChecksToPopulate = (checks: IKeyValueMap<string, boolean>) => {
    let data = {}
    checks.keyValueMapToArray().forEach(kv => {
        // @ts-ignore
        data[kv.key] = kv.value
    })
    return data;
}

export interface IManualDecisionProps {
    caseId?: string;
    taskName?: string;
    actionName?: string;
    resumeCase?: boolean;
    override?: boolean;
    nextSubStatus?: string;
    data?: any;
    manualInstance?: IManualDecision
}

export const manualDecisionInstanceObject = ({
                                                 caseId,
                                                 taskName,
                                                 actionName,
                                                 resumeCase,
                                                 override,
                                                 nextSubStatus,
                                                 data,
                                                 manualInstance
                                             }: IManualDecisionProps) => {

    let manualObject: IManualDecision = <IManualDecision>{}
    // @ts-ignore
    if (!isNullOrEmpty(manualInstance.taskName)) {

        if (manualInstance) {
            manualObject = manualInstance
        }

    } else {

        if (caseId != null) {
            manualObject.caseId = caseId;
        }
        if (taskName != null) {
            manualObject.taskName = taskName;
        }
        if (actionName != null) {
            manualObject.actionName = actionName;
        }
        if (resumeCase) {
            manualObject.resumeCase = resumeCase;
        }
        if (nextSubStatus != null) {
            manualObject.nextSubStatus = nextSubStatus;
        }
        manualObject.data = data;
        if (override) {
            manualObject.override = override;
        }

    }
    return manualObject;

}