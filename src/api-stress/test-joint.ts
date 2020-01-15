import * as faker from "faker";
import {enumToArray, getRandomStr} from "../utils/stringHelpers";
import {CivilStatus, Gender} from "../modules/contacts/types";
const uuid = require('uuid/v4');

const makeApplicant =()=>{
    const withMn = faker.random.number(20) % 2 === 0
    return {
        "person": {
            "firstName": faker.name.firstName(),
            "lastName": faker.name.lastName(),
            "middleName": withMn ? faker.name.lastName() : "",
            "gender": faker.random.arrayElement(enumToArray(Gender)) as Gender,
            "dateOfBirth": faker.date.past(15),
            "civilStatus": faker.random.arrayElement(enumToArray(CivilStatus)) as CivilStatus,
        },
        "address": {
            "country": 800,
            "district": "KAMPA",
            "county": "KAMPA",
            "subCounty": "",
            "village": faker.address.streetAddress(),
            "parish": "SASASA",
            "postalCode": "01258",
            "street": "Kampala"
        },
        "identification": {
            "type": "Nin",
            "idNumber": getRandomStr(),
            "issuingCountry": "Uganda",
            "issueDate": faker.date.past(4),
            "expiryDate": faker.date.future(10),
            "cardNumber": getRandomStr(9),
            "idField1": "Q28DncRDiAOi4ES0A8BaQ5cD5NdC4QPuwIS0BGhfQNoEfLpBDQSgvoN0BKrWgoAE50lE+wVHAEDvBX+rgvAFst5E9gXWeoCoBeUrQeMGVV6GEgZzC4DLBnj+RQoGh4SBtQaXZkJNBr9pg2AGxGiEJgbjeEUzBveKQb8G/HJDGAcldoDlBz6HhDAHe3pFOAeFEEH3B4p4QckHn4RDWwe4AEQhB71+gxgH63VCZwhWgEU9CFuORQoIjQ5CrgjKiIHOCOQLRT0JDASDnQkhnYTYCSuZQwQJWRGDxQltqUJsCXyfQpkJfKpEdwl8tkIaCZuTg1AJpZaCswmqHw==[FNG]1",
            "idField2": "50",
            "idField3": "iBV7PqTA4nOusjbhIfzhM0kvftAwzyjP2oLRnW1RaLUDKvTKb1X0G5lY45Tw1Cw9uq2iTI11audFo95Xzc8vDLtMKVMQiwMWeYLaCSPyIDJzyw+feTznE4i9VRp+hi1C/RfFTAFc6Vtl1Bzw0ieATQ6Pe4V5T0fwN/MInoIg/coTP+eW0+1iR8WM5fcRIFtor4f/Cq8YS9FojcondOhqmLiBphnX3TWrMUP/KoLxo7nuLCBhCJhKncjYesi5NxjOWpG4y0nv9voHrjR2yCDOGqprWXN"
        },
        "metaData": {
            "phone": "0700106164",
            "requestAtmCard": true,
            "signedKfd": true,
            "sourceOfFunds": "Personal Savings",
            "employmentStatus": "self",
            "occupation": "selfe"
        },
    }
}

export const fakeJointRequest = (): any => {
    return {
        "type": "DEMBE-JOINT",
        "referenceNumber": "4505945",
        "externalReference": uuid(),
        "applicationDate": new Date(),
        "caseData": {
            "metaData": {
                "accountName": "Test Joint Account",
                "requestAtmCard": true,
                "requestChequeBook": true,
                "requestQuickBanking": true
            },
            'applicants':[
                makeApplicant(),
                makeApplicant(),
                makeApplicant(),
            ],
            "device": {
                "androidVersion": "26",
                "appId": "e3hZ9SSLlsU",
                "gpsCoordinates": "0.3195606 32.6180306",
                "imei": "357060093217498",
                "imsi": ""
            },
            "user": {
                "id": '1f824a84-46b6-4e7f-b601-5d041118439d',
                "name": "Timothy Emmanuel Kasasa",
                "phone": "0700106164",
                "agentCode": "2345566",
                "branchName": "02",
                "region": "GKLA"
            }
        }
    }
}

