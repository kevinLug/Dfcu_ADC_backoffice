 export const mappingRules = {
    "case": {
        "workflowType": "F3",
        "referenceNumber": 0,
        "externalReference": "",
        "applicationDate": "F2",
        "caseData": {
            "transferDetails": {
                "branchCode": "F1",
                "remittanceType": "F3",
                "currencyCode": "X1",
                "transactionAmount": "X2",
                "remittanceAmount": "X4",
                "exchangeRate": "X3",
                "amountInWords": "X5",
                "transferPurpose": "Z9"
            },
            "bankDetails": {
                "beneficiaryBank": {
                    "bankName": "Z2",
                    "swiftCode": "Z3",
                    "sortCode": "Z4",
                    "aba": "Z5",
                    "fedwire": "Z6",
                    "ifsc": "Z7",
                    "iban": "Z8"
                },
                "applicantBank": {
                    "branchCode": "F1"
                }
            },
            "charges": {
                "chargeMode": "Y1"
            },
            "beneficiaryDetails": {
                "fullName": "X6",
                "accountNumber": "Z1",
                "address": {
                    "town": "X7",
                    "countryCode": "X8",
                    "physicalAddress": "X9"
                }
            },
            "applicantDetails": {
                "fullName": "Y2",
                "accountNumber": "Y8",
                "chequeNumber": "T2",
                "emailAddress": "Y7",
                "phoneNumber": "Y9",
                "natureOfBusiness": "T1",
                "address": {
                    "plotNumber": "Y3",
                    "street": "Y4",
                    "town": "Y5",
                    "district": "Y6"
                }
            },
            "user": {
                "id": "1f824a84-46b6-4e7f-b601-5d041118439d",
                "name": "Enock Mwesigwa",
                "phone": "25787903162",
                "agentCode": "2345566",
                "branchName": "02",
                "region": ""
            }
        }
    }
};


