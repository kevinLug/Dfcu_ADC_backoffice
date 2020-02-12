import React from 'react';
import {Button} from '@storybook/react/demo';
import Index from "../../modules/workflows/actions/templates/kyc-check";
import {ActionStatus, IAction} from "../../modules/workflows/types";
import StoryWrapper from "../StoryWrapper";


export default {
    title: 'KycCheck',
    component: Button,
};

const actionOk: IAction = {
    ignored: false,
    nextStatusError: "",
    nextStatusSuccess: "",
    notifications: [],
    optional: false,
    roles: [],
    skipped: false,
    "name": "regulatory-checks-0",
    "title": "Regulatory checks",
    "description": '',
    "shouldRender": true,
    "template": "kyc-check",
    "errorTemplate": null,
    "runDate": new Date("2020-01-31T13:50:50.194Z"),
    "type": "Post",
    "parameterType": "Body",
    "service": "Kyc",
    "endPoint": "api/check/regulations",
    "status": ActionStatus.Done,
    "statusMessage": '',
    "outputData": "{\"vendor\":\"OFAC\",\"referenceId\":\"d85739ee-230d-4c00-8204-16fa0820e773\",\"checkType\":\"AML\",\"checkStatus\":\"Passed\",\"value\":\"0 hits\",\"comment\":\"-NA-\",\"data\":\"[{\\\"salutation\\\":\\\"\\\",\\\"fname\\\":\\\"Abraham\\\",\\\"initials\\\":\\\"\\\",\\\"lname\\\":\\\"Asiimirwe\\\",\\\"suffix\\\":\\\"\\\",\\\"fnames\\\":[\\\"Abraham\\\"],\\\"pairs\\\":[[\\\"Abraham\\\",\\\"Asiimirwe\\\"]]}]\",\"runDate\":\"2020-01-31T16:50:50.1665389+03:00\"}",
    "inputData": "{\"person\":{\"salutation\":null,\"firstName\":\"ABRAHAM\",\"middleName\":\"\",\"lastName\":\"ASIIMIRWE\",\"gender\":\"Male\",\"dateOfBirth\":\"1994-09-11T00:00:00\",\"civilStatus\":\"Married\",\"id\":\"d0b210be-8c63-44b6-eeb3-08d7a309dfd5\",\"createdAt\":\"2020-01-31T13:50:47.2087237Z\",\"lastUpdated\":null,\"isDeleted\":false},\"referenceId\":\"d85739ee-230d-4c00-8204-16fa0820e773\",\"nationalIdNumber\":\"CM9403410H9HVD\"}",
    "id": "2161235c-a701-4c69-b8c4-83bbe9dfe02a",
    "createdAt": new Date("2020-01-31T13:47:55.254Z"),
    "lastUpdated": null,
    "isDeleted": false
}
export const RegulatorySuccess = () => (
    <StoryWrapper>
        <Index action={actionOk} taskName="" workflowId=''/>
    </StoryWrapper>
);

export const RegulatoryError = () => {
    const outputData = `    
        {
             "vendor": "OFAC",
             "referenceId": "d85739ee-230d-4c00-8204-16fa0820e773",
             "checkType": "AML",
             "checkStatus": "Failed",
             "value": "0hits",
             "comment": "-NA-",
             "data": [
                 {
                   "salutation": "",
                   "fname": "Abraham",
                   "initials": "",
                   "lname": "Asiimirwe",
                   "suffix": "",
                   "fnames": ["Abraham"],
                   "pairs": [["Abraham", "Asiimirwe"]]
                  }
             ],
             "runDate": "2020-01-31T16:50:50.1665389+03:00"
        }
    `;
    const data = {...actionOk, outputData}
    return (

        <StoryWrapper>
            <Index action={data} taskName='' workflowId=''/>
        </StoryWrapper>
    );
};
