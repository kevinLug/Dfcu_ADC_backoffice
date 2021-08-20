import {IKeyValueMap} from "../../utils/collections/map";
import {IManualDecision} from "../workflows/types";
import {isNullOrEmpty} from "../../utils/objectHelpers";


export const populateLabelAndValue = (exclusions: string[] = [], pairs: IKeyValueMap<string, any>, valuePlaceHolder: any) => {

    exclusions.forEach(e => pairs.remove(e))

    pairs.keyValueMapToArray().map((kv): any => {
        if (kv.value === null || kv.value === undefined || kv.value === '')
            return pairs.replace(kv.key, valuePlaceHolder)
    })

    return pairs.keyValueMapToArray();
}

export const getChecksToPopulate = (checks: IKeyValueMap<string, boolean>) => {
    let data = {}
    checks.keyValueMapToArray().forEach(kv => {
        // @ts-ignore
        data[kv.key] = kv.value
    })
    return data;
}

export const getDropdownSelectsToPopulate = (checks: IKeyValueMap<string, boolean>) => {
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