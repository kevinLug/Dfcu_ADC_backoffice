import {getDeepKeys} from "../../../utils/objectHelpers";
import {mappingRules} from "./rules";
import {JSONPath} from "jsonpath-plus";
import {IKeyValueMap, KeyValueMap} from "../../../utils/collections/map";
import _ from "lodash";
import {ICaseDefault} from "../../transfers/types";

class RunMappingRules {


    private objCreated: object = {};
    private objToSend: object = {}
    objectToBeSent: object = {}

    selectorKeysAndValues: IKeyValueMap<any, any>

    constructor() {
        this.setObjToSend(RunMappingRules.setObjectToSend())
        this.selectorKeysAndValues = new KeyValueMap<any, any>();
    }

    setObjectToBeSent(obj: any) {
        this.objectToBeSent = obj
    }

    setObjToSend(obj: {}) {
        this.objToSend = Object.assign(this.objToSend, obj);
    }

    private static setObjectToSend() {
        let obj = {}
        for (const [key, value] of Object.entries(mappingRules)) {

            Object.defineProperty(obj, key, {
                value: value,
                writable: true,
                enumerable: true,
                configurable: true,
            });
        }
        return obj;
    }

    private createObjectFromScanResult(scanResultSplit: string[]) {

        const obj = {};

        // eslint-disable-next-line array-callback-return
        scanResultSplit.map((s) => {

            const pairArray = s.split(":");

            // convert pairArray to key value pair
            if (pairArray[1] !== null && pairArray[1] !== undefined) {
                const key = pairArray[0].trim();
                let value: any = pairArray[1].trim();

                if (value === "null") {
                    value = null;
                }

                // add property to obj
                Object.defineProperty(obj, key, {
                    value: value,
                    writable: true,
                    enumerable: true,
                    configurable: true,
                });

            }
        });
        return obj;
    }

    async getScanResult(resultFromScan: string): Promise<object> {
        let resultTrimmed = resultFromScan.trim();
        const splitResult = resultTrimmed.split(";");
        this.objCreated = this.createObjectFromScanResult(splitResult);
        return await this.runKeysAgainstMappingRules();
    }

    setCase(obj: any) {

        return {
            ...(ICaseDefault),
            applicationDate: obj.case.applicationDate,
            workflowType: obj.case.workflowType,
            externalReference: obj.case.externalReference,
            referenceNumber: obj.case.referenceNumber,
            caseData: obj.case.caseData,
            beneficiaryDetails: obj.case.caseData.beneficiaryDetails,
            bankDetails: obj.case.caseData.bankDetails,
            transferDetails: obj.case.caseData.transferDetails,
        }

    }

    async resetObjectToSend(ruleKeys: any[]) {

        await Promise.all(ruleKeys.map(async (selector) => {
            try {
                const value = JSONPath({path: selector, json: this.objToSend})[0];

                // @ts-ignore
                const valueFromCreatedObject = this.objCreated[value]

                // @ts-ignore
                this.objToSend.selector = valueFromCreatedObject;

                Object.defineProperty(this.objectToBeSent, selector, {
                    value: valueFromCreatedObject,
                    writable: true,
                    enumerable: true,
                    configurable: true,
                });

            } catch (e) {
                console.log('error:', e);
            }
        }))

        return this.objectToBeSent;
    }

    createFinalObject() {
        const r = Object.entries(this.objectToBeSent).map(([k, v]) => {
            if (v === undefined)
                v = null;
            return {property: k, description: v}
        });
        return r.reduce((o, {property, description}) => _.set(o, property, description), {})
    }

    async runKeysAgainstMappingRules() {

        const ruleKeys = getDeepKeys(this.objToSend);

        await this.resetObjectToSend(ruleKeys);

        return this.createFinalObject();

    }

}

export default RunMappingRules;