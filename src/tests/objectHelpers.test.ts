import aCase from './aCase.json'
import {
    isObject,
    isNullOrEmpty,
    testData,
    CriteriaTest,
    ObjectUtils
} from "../utils/objectHelpers";
import {ICase, ICaseData} from "../modules/transfers/types";
import ObjectHelpersFluent from "../utils/objectHelpersFluent";

describe("object method tests", () => {

    it('is present', () => {
        const inst = new ObjectHelpersFluent();
        inst.selector(aCase,"$.workflowType")
            .isPresent();

        console.log(inst.getCheckRuns())

        expect(inst.getSummary().testResult).toEqual(true);
        // expect(isObject({})).toEqual(true);
        // expect(isObject([])).toEqual(true);
    });

    it('is an object', () => {
        const inst = new ObjectHelpersFluent();
        inst.selector(aCase,"$.name")
            .isAbsent();

        console.log(inst.getCheckRuns())

        expect(inst.isNumber().getSummary().testResult).toEqual(false);
        expect(inst.isObject({})).toEqual(true);
        expect(inst.isObject([])).toEqual(true);

    });

    it('is NOT an object', () => {
        const name = "Daniel Comboni";
        const isAnObject = isObject(name);
        expect(isAnObject).toEqual(false);
        expect(isObject(null)).toEqual(false);
        expect(isObject(undefined)).toEqual(false);
        expect(isObject(undefined)).toEqual(false);
    });

    it('is null or empty', () => {
        const nullOrEmpty = isNullOrEmpty("");
        expect(nullOrEmpty).toEqual(true)
    });

    it('is NOT null NOR empty', () => {
        const name = "Daniel Comboni";
        const nullOrEmpty = isNullOrEmpty(name);
        expect(nullOrEmpty).toEqual(false)
    });

});

describe("decision making tests", () => {

    it('value is Present (testData method)', () => {
        const present = testData(CriteriaTest.Presence, aCase.caseData.bankDetails, true);
        expect(present.resultFlag).toEqual(true);
    });

    it('value is Absent (testData method)', () => {
        const absent = testData(CriteriaTest.Absence, aCase.caseData.user.region, true);
        expect(absent.resultFlag).toEqual(true);
    });

    it('value is EqualTo (testData method)', () => {
        const equalTo = testData(CriteriaTest.EqualTo, aCase.workflowType, "RTGS");
        expect(equalTo.resultFlag).toEqual(true);
    });

    it('value is NotEqualTo (testData method)', () => {
        const notEqualTo = testData(CriteriaTest.NotEqualTo, aCase.workflowType, "EFT");
        expect(notEqualTo.resultFlag).toEqual(true);
    });

    it('value is GreaterThan (testData method)', () => {
        const greaterThan = testData(CriteriaTest.GreaterThan, aCase.caseData.transferDetails.rate, 2000);
        expect(greaterThan.resultFlag).toEqual(true);
    });

    it('value is LessThan (testData method)', () => {
        const lessThan = testData(CriteriaTest.LessThan, aCase.caseData.transferDetails.rate, 5000);
        expect(lessThan.resultFlag).toEqual(true);
    });

    it('value is StringContains (testData method)', () => {
        const stringContains = testData(CriteriaTest.StringContains, aCase.workflowType, "RT");
        expect(stringContains.resultFlag).toEqual(true);
    });

    it('value is LessThanOrEqualTo (testData method)', () => {
        const lessThanOrEqualTo = testData(CriteriaTest.LessThanOrEqualTo, aCase.caseData.transferDetails.rate, 3500);
        expect(lessThanOrEqualTo.resultFlag).toEqual(true);
    });

    it('value is GreaterThanOrEqualTo (testData method)', () => {
        const greaterThanOrEqualTo = testData(CriteriaTest.GreaterThanOrEqualTo, aCase.caseData.transferDetails.rate, 3500);
        expect(greaterThanOrEqualTo.resultFlag).toEqual(true);
    });

});

describe('ObjectUtils class tests', () => {

    it('comparing length of properties of two objects', () => {
        const objOne = aCase;
        const objTwo = <ICase>{}
        let objUtils = new ObjectUtils();
        expect(objUtils.comparePropertyLength(objOne, objTwo)).toEqual(true)
    });

    it('comparing property names', () => {
        const objOne = aCase;

        class Case implements ICase {
            applicationDate: string = "";
            caseData: ICaseData = <ICaseData>{};
            externalReference: string = "";
            referenceNumber: number = 0;
            workflowType: string = "";
        }

        const obj = new Case();

        let objUtils = new ObjectUtils();

        expect(objUtils.comparePropertyNamesWithoutPositionConsidered(objOne, obj)).toEqual(true)
    });

    it('iterate and assign object value to recipient object', () => {

        class Case implements ICase {
            applicationDate: string = "";
            caseData: ICaseData = <ICaseData>{};
            externalReference: string = "";
            referenceNumber: number = 0;
            workflowType: string = "";
        }

        let objUtils = new ObjectUtils<Case>();
        const obj = new Case();

        objUtils.iterateAndCopy(aCase, obj);
        // console.log(JSON.stringify(obj,null,2));
        expect(obj).toEqual(aCase)
    });

    it('data object to array of objects', () => {
        let objUtils = new ObjectUtils();
        const result = objUtils.dataObjectToArray(aCase);
        expect(result[4]).toEqual(aCase.caseData);

    });

});
