import * as faker from "faker";
import {enumToArray, getRandomStr} from "../utils/stringHelpers";
import {CivilStatus, Gender} from "../modules/contacts/types";
import {randomInt} from "../utils/numberHelpers";

const uuid = require('uuid/v4');

export const fakeOnBoardRequest = (): any => {
    const withMn = faker.random.number(20) % 2 === 0
    return {
        "workflowType": "emata-on-boarding",
        "referenceNumber": randomInt(100000,500000),
        "externalReference": uuid(),
        "applicationDate": new Date(),
        "caseData": {
            "person": {
                "memberId": uuid(),
                "phone": faker.phone.phoneNumber('+25677#######'),
                "firstName": faker.name.firstName(),
                "lastName": faker.name.lastName(),
                "middleName": withMn ? faker.name.lastName() : "",
                "gender": faker.random.arrayElement(enumToArray(Gender)) as Gender,
                "dateOfBirth": faker.date.past(15),
                "civilStatus": faker.random.arrayElement(enumToArray(CivilStatus)) as CivilStatus,
            },
            "identification": {
                "type": "Nin",
                "idNumber": getRandomStr(),
                "issuingCountry": "Uganda",
                "startDate": faker.date.past(4),
                "expiryDate": faker.date.future(4),
                "cardNumber": getRandomStr(9)
            },
            "address": {
                "country": "Uganda",
                "district": "KAMPA",
                "county": "KAMPA",
                "subCounty": "",
                "village": faker.address.streetAddress(),
                "parish": "SASASA"
            },
            "metaData": {
                "coop": "Kawempe Lugoba",
                "branch": "Kawempe Branch"
            },
            "device": {
                "androidVersion": "26",
                "appId": "e3hZ9SSLlsU",
                "gpsCoordinates": "0.3195606 32.6180306",
                "imei": "357060093217498",
                "imsi": ""
            },
            "user": {
                "id": '1f824a84-46b6-4e7f-b601-5d041118439d',
                "name": "Timothy Emmanuel Kasasa"
            }
        }
    }
}


export const fakeLoanRequest = (): any => {
    return {
        "workflowType": "ussd-loan",
        "referenceNumber": "4505945",
        "externalReference": uuid(),
        "applicationDate": faker.date.past(),
        "caseData": {
            "application": {
                "phone": faker.phone.phoneNumber('+25677#######'),
                "sessionId": uuid(),
                "loanAmount": 1000,
                "repaymentPlan": {
                    "period": 15,
                    "timeUnit": "days",
                    "interestRate": "12"
                }
            },
            "dependencies": [
                "9ca948dd-94a0-49b6-ba6e-01fd334a6d56"
            ],
            "metaData": {},
            "user": {
                "id": '1f824a84-46b6-4e7f-b601-5d041118439d',
                "name": "Timothy Emmanuel Kasasa"
            }
        }
    }
}

export const fakeDembeRequest = (): any => {
    const withMn = faker.random.number(20) % 2 === 0
    return {
        "type": "DEMBE-ACCOUNT",
        "referenceNumber": randomInt(100000,500000),
        "externalReference": uuid(),
        "applicationDate": faker.date.past(),
        "caseData": {
            "person": {
                "firstName": faker.name.firstName(),
                "lastName": faker.name.lastName(),
                "middleName": withMn ? faker.name.lastName() : "",
                "gender": faker.random.arrayElement(enumToArray(Gender)) as Gender,
                "dateOfBirth": faker.date.past(15),
                "civilStatus": faker.random.arrayElement(enumToArray(CivilStatus)) as CivilStatus,
                "phone": "0700106164"
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
                "startDate": faker.date.past(4),
                "expiryDate": faker.date.future(4),
                "cardNumber": getRandomStr(9),
                "idField1": "Q28DncRDiAOi4ES0A8BaQ5cD5NdC4QPuwIS0BGhfQNoEfLpBDQSgvoN0BKrWgoAE50lE+wVHAEDvBX+rgvAFst5E9gXWeoCoBeUrQeMGVV6GEgZzC4DLBnj+RQoGh4SBtQaXZkJNBr9pg2AGxGiEJgbjeEUzBveKQb8G/HJDGAcldoDlBz6HhDAHe3pFOAeFEEH3B4p4QckHn4RDWwe4AEQhB71+gxgH63VCZwhWgEU9CFuORQoIjQ5CrgjKiIHOCOQLRT0JDASDnQkhnYTYCSuZQwQJWRGDxQltqUJsCXyfQpkJfKpEdwl8tkIaCZuTg1AJpZaCswmqHw==[FNG]1",
                "idField2": "50",
                "idField3": "iBV7PqTA4nOusjbhIfzhM0kvftAwzyjP2oLRnW1RaLUDKvTKb1X0G5lY45Tw1Cw9uq2iTI11audFo95Xzc8vDLtMKVMQiwMWeYLaCSPyIDJzyw+feTznE4i9VRp+hi1C/RfFTAFc6Vtl1Bzw0ieATQ6Pe4V5T0fwN/MInoIg/coTP+eW0+1iR8WM5fcRIFtor4f/Cq8YS9FojcondOhqmLiBphnX3TWrMUP/KoLxo7nuLCBhCJhKncjYesi5NxjOWpG4y0nv9voHrjR2yCDOGqprWXN"
            },
            "metaData": {
                "requestAtmCard": true,
                "signedKfd": true,
                "sourceOfFunds": "Personal Savings",
                "employmentStatus": "self",
                "occupation": "selfe"
            },
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

