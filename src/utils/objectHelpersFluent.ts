import {JSONPath} from 'jsonpath-plus'
import {CriteriaTest, IMessage, isNullOrEmpty, isObject} from "./objectHelpers";
import * as process from "process";
import {environment} from "../data/constants";
import * as yup from 'yup';
import validate from "validate.js";
import {IKeyValueMap, IKeyValueObject, KeyValueMap} from "./collections/map";

export interface ITestDataSummary {
    criterion: CriteriaTest;
    testResult: boolean;
    data: any,
    selector: string,
    value: any;
    expected: any;
    // message?: IMessage
    devMessage?: string
}


let indexCount: number = 0

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
    private flag:boolean;

    constructor() {
        indexCount += 1
        this.value = null
        this.data = null
        this.selectorPath = ''
        this.checksRun = new KeyValueMap<string, boolean>();
        this.flag = false;
    }

    isIgnorable(){
        this.summary.testResult = true;
        console.log("ignored")
        return this;
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

    setFlag(flag: boolean){
        this.flag = flag;
        return this;
    }

    getFlag(){
        return this.flag;
    }

    getCheckRuns(){
        return this.checksRun;
    }

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

    directValue(directValue:any) {
        this.summary.value = directValue
        return this;
    }

    private addToCheckRuns(testName:string,result:boolean){
        if (this.checksRun.size() === 0){
            const firstCheck = new KeyValueMap<string,boolean>();
            firstCheck.put(testName,result);
            this.checksRun = firstCheck;
        }else {
            this.checksRun.put(testName,result);
        }
    }

    isPresent() {
        this.summary.testResult = validate.isEmpty(this.value)
        this.summary.expected = true;
        this.summary.testResult ? this.summary.testResult = false : this.summary.testResult = true
        this.addToCheckRuns("IS_PRESENT", this.summary.testResult)
        this.setFlag(this.summary.testResult)
        return this;
    }

    isAbsent() {
        this.summary.testResult = validate.isEmpty(this.value)
        this.summary.expected = true;
        this.addToCheckRuns("IS_ABSENT", this.summary.testResult)
        this.setFlag(this.summary.testResult)
        return this;
    }

    isNumber() {
        this.summary.testResult = validate.isNumber(this.value)
        this.summary.expected = true;
        this.addToCheckRuns("Is_NUMBER", this.summary.testResult)
        this.setFlag(this.summary.testResult)
        return this;
    }

    isObject(obj?:any) {
        if (obj){
            return validate.isObject(obj);
        }
        this.summary.testResult = validate.isObject(this.value)
        this.summary.expected = true;
        this.addToCheckRuns("IS_OBJECT", this.summary.testResult)
        this.setFlag(this.summary.testResult)
        return this;
    }

    isString() {
        this.summary.testResult = validate.isString(this.value)
        this.summary.expected = true;
        this.addToCheckRuns("IS_STRING", this.summary.testResult)
        this.setFlag(this.summary.testResult)
        return this;
    }

    isDefined() {
        this.summary.testResult = validate.isDefined(this.value)
        this.summary.expected = true;
        this.addToCheckRuns("IS_DEFINED", this.summary.testResult)
        this.setFlag(this.summary.testResult)
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

    isLessThan(greaterNumber:number){
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

    isEqualTo(value:any){
        this.summary.testResult = this.summary.value === value
        this.summary.expected = true;
        this.addToCheckRuns("IS_EQUAL_TO", this.summary.testResult)
        this.setFlag(this.summary.testResult)
        return this;
    }

    isNOTEqualTo(value:any){
        this.summary.testResult = this.summary.value !== value
        this.summary.expected = true;
        this.addToCheckRuns("IS_EQUAL_TO", this.summary.testResult)
        this.setFlag(this.summary.testResult)
        return this;
    }

    contains(containedValue:any){
        this.summary.testResult = validate.contains(this.summary.value,containedValue)
        this.summary.expected = true;
        this.addToCheckRuns("CONTAINS", this.summary.testResult)
        this.setFlag(this.summary.testResult)
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
        console.log(`The value:-`,JSON.stringify(value,null,2))
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
        return this.value;
    }

    ifCondition(){

        return this;
    }


}

export default ObjectHelpersFluent

