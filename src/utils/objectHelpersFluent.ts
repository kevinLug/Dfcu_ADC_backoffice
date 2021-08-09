import {JSONPath} from 'jsonpath-plus'
import {CriteriaTest, isNullOrEmpty, isObject} from "./objectHelpers";

import validate from "validate.js";
import {IKeyValueMap, KeyValueMap} from "./collections/map";
import {environment} from "../data/constants";

export interface ITestDataSummary {
    title?: string;
    userFailureMessage?: string;
    userSuccessMessage?: string;
    ignored?: boolean;
    criterion: CriteriaTest;
    testResult: boolean;
    data: any,
    selector: string,
    value: any;
    expected: any;
    // message?: IMessage
    devMessage?: string
}


class ObjectHelpersFluent {
    private data: any
    private value: any;
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    private summary: ITestDataSummary = <ITestDataSummary>{}
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    // private message: IMessage = <IMessage>{}
    private continuationFlag: boolean = false
    private selectorPath: string
    private checksRun: IKeyValueMap<string, boolean>
    private flag: boolean;

    private static finalTestResultsFromChecksRun: IKeyValueMap<number, ITestDataSummary> = new KeyValueMap<number, ITestDataSummary>();

    constructor() {
        this.value = null
        this.data = null
        this.selectorPath = ''
        this.checksRun = new KeyValueMap<string, boolean>();
        this.flag = false;
    }

    // public static setFinalTestResultsFromChecksRun(finalTestResultsFromChecksRun: IKeyValueMap<number, ITestDataSummary>) {
    //     ObjectHelpersFluent.finalTestResultsFromChecksRun = finalTestResultsFromChecksRun
    // }

    public static getFinalTestResultsFromChecksRun() {
        return ObjectHelpersFluent.finalTestResultsFromChecksRun
    }

    private static addToFinalTestResultsFromChecksRun(result: ITestDataSummary) {
        if (ObjectHelpersFluent.finalTestResultsFromChecksRun.size() === 0) {
            const first = new KeyValueMap<number, ITestDataSummary>();
            first.put(0, result);
            ObjectHelpersFluent.finalTestResultsFromChecksRun = first
        } else {
            const index = ObjectHelpersFluent.finalTestResultsFromChecksRun.size()
            ObjectHelpersFluent.finalTestResultsFromChecksRun.put(index, result);
        }
    }

    isIgnorable() {
        this.summary.testResult = true;
        this.summary.ignored = true;
        console.log("ignored")

        return this;
    }

    addUserFailureMessage(msg: string) {
        this.summary.userFailureMessage = msg;
        return this
    }

    addUserSuccessMessage(msg: string) {
        this.summary.userSuccessMessage = msg;
        return this
    }

    // log(value: any,label?:string) {
    //     if (environment === 'dev') {
    //         if (!validate.isEmpty(label)){
    //             console.log(label,{value})
    //         }else {
    //             console.log('The value:-',{value})
    //         }
    //     }
    // }

    setFlag(flag: boolean) {
        this.flag = flag;
        return this;
    }

    getFlag() {
        return this.flag;
    }

    getCheckRuns() {
        return this.checksRun;
    }

    /**
     *
     * @param object
     * @param selector
     * @param callBackBeforeSelection
     * @param callBackAfterSelection
     */
    selector(object: any, selector: string, callBackBeforeSelection?: (...args: any) => any, callBackAfterSelection?: (...args: any) => any) {
        this.selectorPath = selector
        if (callBackBeforeSelection) {
            callBackBeforeSelection()
        }

        this.value = JSONPath({path: selector, json: object})[0]
        this.summary.selector = selector;
        this.summary.data = object
        this.summary.value = this.value;

        if (callBackAfterSelection) {
            callBackAfterSelection()
        }

        return this;
    }

    directValue(directValue: any) {
        this.summary.value = directValue
        return this;
    }

    private addToCheckRuns(testName: string, result: boolean) {
        if (this.checksRun.size() === 0) {
            const firstCheck = new KeyValueMap<string, boolean>();
            firstCheck.put(testName, result);
            this.checksRun = firstCheck;
        } else {
            this.checksRun.put(testName, result);
        }
    }

    isPresent() {
        this.summary.testResult = validate.isEmpty(this.summary.value)
        this.summary.expected = true;
        this.summary.testResult ? this.summary.testResult = false : this.summary.testResult = true
        this.addToCheckRuns("IS_PRESENT", this.summary.testResult)
        this.setFlag(this.summary.testResult)
        ObjectHelpersFluent.addToFinalTestResultsFromChecksRun(this.summary)
        return this;
    }

    isAbsent() {
        this.summary.testResult = validate.isEmpty(this.summary.value)
        this.summary.expected = true;
        this.addToCheckRuns("IS_ABSENT", this.summary.testResult)
        this.setFlag(this.summary.testResult)
        ObjectHelpersFluent.addToFinalTestResultsFromChecksRun(this.summary)
        return this;
    }

    isNumber() {
        this.summary.testResult = validate.isNumber(this.value)
        this.summary.expected = true;
        this.addToCheckRuns("Is_NUMBER", this.summary.testResult)
        this.setFlag(this.summary.testResult)
        ObjectHelpersFluent.addToFinalTestResultsFromChecksRun(this.summary)
        return this;
    }

    isObject(obj?: any) {
        if (obj) {
            return validate.isObject(obj);
        }
        this.summary.testResult = validate.isObject(this.value)
        this.summary.expected = true;
        this.addToCheckRuns("IS_OBJECT", this.summary.testResult)
        this.setFlag(this.summary.testResult)
        ObjectHelpersFluent.addToFinalTestResultsFromChecksRun(this.summary)
        return this;
    }

    isString() {
        this.summary.testResult = validate.isString(this.value)
        this.summary.expected = true;
        this.addToCheckRuns("IS_STRING", this.summary.testResult)
        this.setFlag(this.summary.testResult)
        ObjectHelpersFluent.addToFinalTestResultsFromChecksRun(this.summary)
        return this;
    }

    isDefined() {
        this.summary.testResult = validate.isDefined(this.value)
        this.summary.expected = true;
        this.addToCheckRuns("IS_DEFINED", this.summary.testResult)
        this.setFlag(this.summary.testResult)
        ObjectHelpersFluent.addToFinalTestResultsFromChecksRun(this.summary)
        return this;
    }

    isGreaterThan(lesserNumber: number) {
        this.summary.testResult = validate.isDefined(this.value)

        if (!validate.isNumber(this.summary.value)) {
            this.summary.value = Number(this.summary.value)
        }

        this.summary.testResult = this.summary.value > lesserNumber
        this.summary.expected = true;
        this.addToCheckRuns("IS_GREATER_THAN", this.summary.testResult)
        this.setFlag(this.summary.testResult)
        ObjectHelpersFluent.addToFinalTestResultsFromChecksRun(this.summary)
        return this;
    }

    isGreaterThanOrEqualTo(lesserNumber: number) {
        this.summary.testResult = validate.isDefined(this.value)

        if (!validate.isNumber(this.summary.value)) {
            this.summary.value = Number(this.summary.value)
        }

        this.summary.testResult = this.summary.value >= lesserNumber
        this.summary.expected = true;
        this.addToCheckRuns("IS_GREATER_THAN_OR_EQUAL_TO", this.summary.testResult)
        this.setFlag(this.summary.testResult)
        ObjectHelpersFluent.addToFinalTestResultsFromChecksRun(this.summary)
        return this;
    }

    isLessThanOrEqualTo(greaterNumber: number) {
        this.summary.testResult = validate.isDefined(this.value)

        if (!validate.isNumber(this.summary.value)) {
            this.summary.value = Number(this.summary.value)
        }

        this.summary.testResult = this.summary.value <= greaterNumber
        this.summary.expected = true;
        this.addToCheckRuns("IS_LESS_THAN_OR_EQUAL_TO", this.summary.testResult)
        this.setFlag(this.summary.testResult)
        return this;
    }

    isLessThan(greaterNumber: number) {
        this.summary.testResult = validate.isDefined(this.value)

        if (!validate.isNumber(this.summary.value)) {
            this.summary.value = Number(this.summary.value)
        }

        this.summary.testResult = this.summary.value < greaterNumber
        this.summary.expected = true;
        this.addToCheckRuns("IS_LESS_THAN", this.summary.testResult)
        this.setFlag(this.summary.testResult)
        return this;
    }

    isEqualTo(expectedValue: any) {

        this.summary.testResult = JSON.stringify(this.summary.value) === JSON.stringify(expectedValue)
        this.summary.expected = expectedValue;
        this.addToCheckRuns("IS_EQUAL_TO", this.summary.testResult)
        this.setFlag(this.summary.testResult)
        ObjectHelpersFluent.addToFinalTestResultsFromChecksRun(this.summary)
        return this;
    }

    isNOTEqualTo(value: any) {
        this.summary.testResult = this.summary.value !== value
        this.summary.expected = true;
        this.addToCheckRuns("IS_NOT_EQUAL_TO", this.summary.testResult)
        this.setFlag(this.summary.testResult)
        ObjectHelpersFluent.addToFinalTestResultsFromChecksRun(this.summary)
        return this;
    }

    contains(containedValue: any) {
        this.summary.testResult = validate.contains(this.summary.value, containedValue)
        this.summary.expected = true;
        this.addToCheckRuns("CONTAINS", this.summary.testResult)
        this.setFlag(this.summary.testResult)
        ObjectHelpersFluent.addToFinalTestResultsFromChecksRun(this.summary)
        return this;
    }

    validateValue(criterion: CriteriaTest, expected: any) {

        this.summary.criterion = criterion

        switch (criterion) {

            case CriteriaTest.IsAnObject:
                this.summary.testResult = isObject(this.value)
                this.summary.expected = true
                return this;

            case CriteriaTest.Presence:
                const data = JSON.stringify(this.value)
                this.summary.testResult = !isNullOrEmpty(data)
                this.summary.expected = expected
                return this;

            case CriteriaTest.Absence:
                this.summary.testResult = isNullOrEmpty(this.value)
                this.summary.expected = expected
                return this;

            case CriteriaTest.EqualTo:
                this.summary.expected = expected
                this.summary.testResult = (this.value === expected)
                return this;

            case CriteriaTest.NotEqualTo:
                this.summary.expected = expected
                this.summary.testResult = (this.value !== expected)
                return this;

            case CriteriaTest.GreaterThan:
                this.summary.expected = expected
                this.summary.testResult = (Number(this.value) > Number(expected))
                return this;

            case CriteriaTest.LessThan:
                this.summary.expected = expected
                this.summary.testResult = (Number(this.value) < Number(expected))
                return this;

            case CriteriaTest.StringContains:
                this.summary.expected = expected
                this.summary.testResult = (isNullOrEmpty(this.value) && this.value.toString().includes(expected))
                return this;

            case CriteriaTest.LessThanOrEqualTo:
                this.summary.expected = expected
                this.summary.testResult = (Number(this.value) <= Number(expected))
                return this;

            case CriteriaTest.GreaterThanOrEqualTo:
                this.summary.expected = expected
                this.summary.testResult = (Number(this.value) >= Number(expected))
                return this;

        }
    }

    getSummary() {
        this.summary.value = this.value
        return this.summary;
    }

    // todo
    logSelector() {

    }

    // todo...index to show the position of the test (number of tests run) + title of the test as well
    testTitle(title: string) {
        this.summary.title = title
        console.log(`title:--> ${title} <--`);
        return this;
    }

    logNewLineSpace() {
        console.log("")
        return this
    }

    // todo base this on env...i production, this should not happen
    logSummary(shouldLog: boolean = true) {
        if (shouldLog) {
            if (this.summary.testResult) {
                // @ts-ignore
                this.summary.devMessage = ">>>PASSED<<<"
                console.log(`summary: ${this.summary}`)
            } else {
                // @ts-ignore
                this.summary.devMessage = ">>>FAILED<<<"
                console.log(`summary: ${this.summary}`)
            }

        }
        return this;
    }

    logTestMessage() {
        if (this.summary.testResult) {
            // @ts-ignore
            this.summary.devMessage = ">>>PASSED<<<"
            console.log(`test message: ${this.summary.devMessage}`)
        } else {
            // @ts-ignore
            this.summary.devMessage = ">>>FAILED<<<"
            console.log(`test message: ${this.summary.devMessage}`)
        }
        return this
    }

    logValue() {
        const value = this.summary.value;
        console.log(`The value:-`, JSON.stringify(value, null, 2))
        return this
    }

    logDetailed() {
        const env = environment.toLowerCase()
        if (env === 'dev' || env === 'development' || env === 'test') {
            this.logValue();
            console.log(`criterion: `, this.getCheckRuns().getKeys().get(0));
            console.log("Expected: ", this.summary.expected)
            this.logTestResult();
            this.logTestMessage();
            // this.logSummary()
            this.logNewLineSpace();
        }
        return this
    }

    logTestResult() {
        console.log(`test result: `, this.summary.testResult)
        return this
    }

    setContinuationFlag(flag: boolean) {
        this.continuationFlag = flag
        return this
    }

    getContinuationFlag() {
        return this.continuationFlag
    }

    getValue() {
        return this.summary.value;
    }

    ifCondition(condition: boolean) {
        if (condition)
            return this;
    }

    successCallBack(call: (data?: any) => any) {
        if (this.summary.testResult) {
            call()
        }
        return this
    }

    failureCallBack(call: (data?: any) => any) {
        if (!this.summary.testResult) {
            call()
        }
        return this
    }

    haltProcess(callBackShouldRun?: boolean, shouldHaltIfTestResultFails?: boolean, haltCallBack?: (data?: any) => any, customCondition?: boolean) {
        if (haltCallBack && callBackShouldRun) {
            haltCallBack()
        }

        // only used when testResult is true but you want to halt anyway
        if (customCondition !== null && customCondition !== undefined) {
            // eslint-disable-next-line no-throw-literal
            throw 'process halted!'
        } else {
            if (shouldHaltIfTestResultFails) {
                if (!this.summary.testResult) {
                    console.log("test result halt:", this.summary.testResult)
                    // eslint-disable-next-line no-throw-literal
                    throw 'process halted!'
                }
            }
        }

    }


}

export const fluentValidationInstance = () => new ObjectHelpersFluent()

export default ObjectHelpersFluent

