import aCase from './aCase.json'
import ObjectHelpersFluent from "../utils/objectHelpersFluent";
import {CriteriaTest} from "../utils/objectHelpers";

describe('fluent object helper test', () => {
    it('selector method test', () => {
        const v = new ObjectHelpersFluent()
            .selector(aCase, "$", () => {
                console.log(`about to test selector`)
            }, () => {
                console.log(`just done testing selector`)
            })
            .getSummary()
        expect(v.selector).toEqual("$")
    });

    it('test workflowType is RTGS',  ()=> {
        new ObjectHelpersFluent()
            .selector(aCase,"$.workflowType")
            .validateValue(CriteriaTest.EqualTo, "RTGS")
            // .logSummary(false)
    });

})