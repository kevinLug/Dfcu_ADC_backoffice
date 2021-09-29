import * as yup from 'yup';
import {JSONPath} from 'jsonpath-plus'
import {reqMsg} from "../data/validations";

export const invalidInputs = [null, 'null', 'undefined', undefined, '']
const requiredStr = yup.string().required().notOneOf(invalidInputs)

class ValidationFluent {

    private value: any
    private continuationFlag: boolean = false

    constructor() {
        this.value = null
    }

    selector(object: any, selector: string,) {
        this.value = JSONPath({path: selector, json: object})[0]
    }

    required(msg: string = '') {
        yup.string().required(msg).notOneOf(invalidInputs)
    }

    present() {
        let schema = yup.string();
        const strValue = JSON.stringify(this.value)


        for (let invalidInput of invalidInputs) {
            if (strValue === invalidInput) {
                this.continuationFlag = false;
                break;
            } else {
                this.continuationFlag = true;
            }
        }

        invalidInputs.forEach(input => {

        })
        return this
    }


}

export default ValidationFluent