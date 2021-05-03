// Warning https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name#function_names_in_classes
// the warning is for the || portion
export const isObject = (objValue: any): boolean => (objValue && typeof objValue === 'object' && objValue.constructor === Object);
export const isObjectInstance = (objValue: any, className?: string): boolean => objValue.constructor.name === className

export const checkNested = (object: any, ...rest: any) => {

}

export const isNullOrEmpty = (str: string): boolean => str.trim() === null || str.trim() === "";

export enum CriteriaTest {
    //Value should be present
    Presence = "Present",
    //Value should not be present
    Absence = "Absent",
    EqualTo = "EqualTo",
    NotEqualTo = "NotEqualTo",
    GreaterThan = "GreaterThan",
    LessThan = "LessThan",
    StringContains = "StringContains",
    GreaterThanOrEqualTo = "GreaterThanOrEqualTo",
    LessThanOrEqualTo = "LessThanOrEqualTo",

    IsAnObject = "IsAnObject",
}

export default class DeterminantFlag {
    static flag: boolean = false

    static setFlag(flag: boolean): void {
        DeterminantFlag.flag = flag
    }

    static getFlag(): boolean {
        return DeterminantFlag.flag;
    }
}

export interface ITestDataResult {
    criterion: CriteriaTest;
    resultFlag: boolean;
    data: any;
    expected: any;
    message?: IMessage
}

export interface IMessage {
    developerMessageFailure?: string;
    developerMessageSuccess?: string;
    userMessageFailure?: string;
    userMessageSuccess?: string;
}

const print = (message: any) => console.log(message);

const setTestResult = (criterion: CriteriaTest, resultFlag: boolean, data: any, expected?: any, devMsgFailure?: string, userMsgFailure?: string, devMsgSuccess?: string, userMessageSuccess?: string): ITestDataResult => {
    const msg: IMessage = {
        developerMessageFailure: devMsgFailure,
        developerMessageSuccess: devMsgSuccess,
        userMessageFailure: userMsgFailure,
        userMessageSuccess: userMessageSuccess,
    }
    const result: ITestDataResult = {
        criterion,
        resultFlag,
        data,
        expected,
        message: msg
    };
    DeterminantFlag.setFlag(resultFlag)
    if (resultFlag) {
        console.log('passed - test details', {result});
    } else {
        console.log('failed - test details', {result});
    }

    return result;
};

export const testData = (criterion: CriteriaTest, data: any, expected?: any, devMsgFailure?: string, userMsgFailure?: string, devMsgSuccess?: string, userMessageSuccess?: string): ITestDataResult => {
    const dataStr = data.toString();
    switch (criterion) {
        case CriteriaTest.Presence:
            return setTestResult(criterion, !isNullOrEmpty(dataStr), data, expected, devMsgFailure, userMsgFailure, devMsgSuccess, userMessageSuccess);
        case CriteriaTest.Absence:
            return setTestResult(criterion, isNullOrEmpty(dataStr), data, expected, devMsgFailure, userMsgFailure, devMsgSuccess, userMessageSuccess);
        case CriteriaTest.EqualTo:
            return setTestResult(criterion, data === expected, data, expected, devMsgFailure, userMsgFailure, devMsgSuccess, userMessageSuccess);
        case CriteriaTest.NotEqualTo:
            return setTestResult(criterion, data !== expected, data, expected, devMsgFailure, userMsgFailure, devMsgSuccess, userMessageSuccess);
        case CriteriaTest.GreaterThan:
            return setTestResult(criterion, !isNullOrEmpty(dataStr) && Number(data) > Number(expected), data, expected, devMsgFailure, userMsgFailure, devMsgSuccess, userMessageSuccess);
        case CriteriaTest.LessThan:
            return setTestResult(criterion, !isNullOrEmpty(dataStr) && Number(data) < Number(expected), data, expected, devMsgFailure, userMsgFailure, devMsgSuccess, userMessageSuccess);
        case CriteriaTest.StringContains:
            return setTestResult(criterion, !isNullOrEmpty(dataStr) && data.toString().includes(expected), data, expected, devMsgFailure, userMsgFailure, devMsgSuccess, userMessageSuccess);
        case CriteriaTest.LessThanOrEqualTo:
            return setTestResult(criterion, !isNullOrEmpty(dataStr) && Number(data) <= Number(expected), data, expected, devMsgFailure, userMsgFailure, devMsgSuccess, userMessageSuccess);
        case CriteriaTest.GreaterThanOrEqualTo:
            return setTestResult(criterion, !isNullOrEmpty(dataStr) && Number(data) >= Number(expected), data, expected, devMsgFailure, userMsgFailure, devMsgSuccess, userMessageSuccess);

        case CriteriaTest.IsAnObject:
            return setTestResult(criterion, !isObject(data), data, expected, devMsgFailure, userMsgFailure, devMsgSuccess, userMessageSuccess);
    }
};

export const testDataCallBack = (testResult: ITestDataResult, callBackFailure?: () => any, callBackSuccess?: () => any, stopProcess: boolean = false) => {

    if (!testResult.resultFlag) {
        if (callBackFailure !== null && callBackFailure !== undefined) {
            callBackFailure()
        }

        if (stopProcess) {
            throw 'process stopped, please double check immediate log above';
        }

    } else {
        if (callBackSuccess !== null && callBackSuccess !== undefined) {
            callBackSuccess()
        }
    }

}

export const objectBreakDown = (obj: any) => {


    if (isObject(obj)) {
        for (let property in obj) {
            for (let newProperty in obj[property]) {
                const newObj = obj[property][newProperty];
                if (isObject(newObj)) {
                    // perform some actions on the object value
                    console.log(`\n${newProperty} ${typeof newProperty} \n=================`);
                    console.log(obj[property][newProperty]);
                } else {
                    if (isNaN(Number(newProperty))) {
                        console.log(obj[property][newProperty]);
                        // perform some action on the value here
                    }
                }
            }
            if (isObject(obj[property])) {
                objectBreakDown(obj[property]);
            }
        }
    }
};

export class ObjectUtils<T> {

    public isObject(objValue: any): boolean {
        // @ts-ignore
        // Warning https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name#function_names_in_classes
        return objValue instanceof T && objValue.constructor.name;
    }

    /**
     * Compares the `length` or `number` of properties in the two `objects`.
     * @param fromObject
     * @param toObject
     * @returns `boolean` : whether the numbers are equal or not
     */
    public comparePropertyLength(fromObject: Object, toObject: T): boolean {

        let lengthOfKeysOfReceivedObject: number = 0;

        for (let keyAsProperty in fromObject) {
            lengthOfKeysOfReceivedObject += 1;
        }

        let lengthOfKeysOfReceivingObject: number = 0;

        for (let keyAsProperty in fromObject) {
            lengthOfKeysOfReceivingObject += 1;
        }
        // console.log({lengthOfKeysOfReceivedObject}, {lengthOfKeysOfReceivingObject})
        return lengthOfKeysOfReceivingObject === lengthOfKeysOfReceivedObject;
    }

    /**
     * Compares the `names` of the `properties` of the two `objects`.
     *
     * NOTE: Checks if objects have got `matching property names` in matching `positions`.
     *
     * Returns a boolean:
     * @param fromObject
     * @param toObject
     * @returns `boolean` : if the two objects have the `same property names in the same positions`, it returns `true`
     */
    public comparePropertyNamesWithPositionConsidered(fromObject: Object, toObject: T) {

        let receivedObjectPropertyNames = [];
        for (let keyAsProperty in fromObject) {
            console.log("received", {keyAsProperty})
            receivedObjectPropertyNames.push(keyAsProperty);
        }

        let receivingObjectPropertyNames = []
        for (let keyAsProperty in toObject) {
            console.log("recipient", {keyAsProperty})
            receivingObjectPropertyNames.push(keyAsProperty);
        }

        let flag: boolean = false;
        for (let i = 0; i <= receivedObjectPropertyNames.length; i++) {

            if (receivedObjectPropertyNames[i] !== receivingObjectPropertyNames[i]) {
                flag = false;
                break;
            } else {
                flag = true;
            }

        }

        return flag;
    }


    /**
     * Compares the `names` of the `properties` of the two `objects`.
     *
     * NOTE: Checks if objects have got `matching property names` regardless of matching `positions`.
     *
     * Returns a boolean:
     * @param fromObject
     * @param toObject
     * @returns `boolean` : if the two objects have the `same property names in the same positions`, it returns `true`
     */
    public comparePropertyNamesWithoutPositionConsidered(fromObject: Object, toObject: T) {

        let receivedObjectPropertyNames = [];
        for (let keyAsProperty in fromObject) {
            receivedObjectPropertyNames.push(keyAsProperty);
        }

        let receivingObjectPropertyNames = []
        for (let keyAsProperty in toObject) {
            receivingObjectPropertyNames.push(keyAsProperty);
        }

        let flag: boolean = false;
        for (let i = 0; i < receivedObjectPropertyNames.length; i++) {

            if (!receivedObjectPropertyNames.includes(receivingObjectPropertyNames[i])) {
                flag = false;
                break;
            } else {
                // console.log("recipient", receivingObjectPropertyNames[i]);
                flag = true;
            }

        }

        return flag;
    }


    /**
     * Copies values of `fromObject` into `toObject`.
     *
     * Success is only if both the `comparePropertyNames(fromObject, toObject)` and `comparePropertyLength(fromObject, toObject)`
     * methods resolve to true.
     *
     * @param fromObject
     * @param toObject
     */
    public iterateAndCopy(fromObject: Object, toObject: T): T {

        const namesComparisonFlag = this.comparePropertyNamesWithoutPositionConsidered(fromObject, toObject);
        const lengthComparisonFlag = this.comparePropertyLength(fromObject, toObject);

        if (namesComparisonFlag && lengthComparisonFlag) {

            for (let [keyAsProperty, valueOfProperty] of Object.entries(fromObject)) {

                // @ts-ignore
                if (toObject.hasOwnProperty(keyAsProperty)) {
                    // @ts-ignore
                    toObject[keyAsProperty] = valueOfProperty;
                }

            }
        }

        return toObject;
    }

    /**
     * Converts the `data` object to `Array` of objects
     * @param data the object returned in the http response
     * @returns an Array of objects
     */
    public dataObjectToArray(data: Object): Array<T> {
        // @ts-ignore
        return Array.from(Object.keys(data), key => data[key]);
    }

}