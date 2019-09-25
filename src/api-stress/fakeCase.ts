import * as faker from "faker";
import {enumToArray, getRandomStr} from "../utils/stringHelpers";
import {CivilStatus, Gender} from "../modules/contacts/types";

const uuid = require('uuid/v4');

export const fakeOnBoardRequest = (): any => {
    const withMn = faker.random.number(20) % 2 === 0
    return {
        "type": "emata-on-boarding",
        "referenceNumber": uuid(),
        "externalReference": "4505945",
        "applicationDate": faker.date.past(),
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
                "id": uuid(),
                "name": "Timothy Kasasa"
            }
        }
    }
}
