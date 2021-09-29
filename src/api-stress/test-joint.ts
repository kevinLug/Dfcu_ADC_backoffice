import * as faker from "faker";
import {enumToArray, getRandomStr} from "../utils/stringHelpers";
import {CivilStatus, Gender} from "../modules/contacts/types";
import {randomInt} from "../utils/numberHelpers";

const uuid = require("uuid/v4");

const makeBeneficiaryAddress = () => {
    return {
        country: faker.address.country(),
        town: faker.address.county(),
        plot: faker.address.streetAddress(),
        building: faker.address.streetAddress(),
    };
};

const makeBeneficiaryName = () => faker.name.firstName().concat(" ").concat(faker.name.lastName());
const makeName = () => faker.name.firstName().concat(" ").concat(faker.name.lastName());
const makeEmail = (name: string) => faker.internet.email(name);

const makeSender = () => {
    const madeName = makeName();
    return {
        name: madeName,
        email: makeEmail(madeName),
        accountNumber: faker.finance.account(),
        telephone: faker.phone.phoneNumber(),
        natureOfBusiness: faker.commerce.productName(),
        chequeNumber: 501500,
        physicalAddress: {
            plotNumber: faker.address.secondaryAddress(),
            street: faker.address.streetName(),
            town: faker.address.county(),
            district: faker.address.city(),
            signatureOfMandate: "",
        },
    };
};

export const fakeRTGSRequest = (): any => {
    const transferDetails = {
        branch: faker.address.streetName(),
        type: "RTGS",
        rate: 3500,
        currency: "USD",
        amount: 600,
        ugxAmount: 2200000,
        amountInWords: "",
        beneficiaryName: makeBeneficiaryName(),
        beneficiaryAddress: makeBeneficiaryAddress(),
    }
    const sender = makeSender()
    const type = "RTGS";
    return {
        workflowType: type,
        referenceNumber: randomInt(100000, 500000),
        externalReference: uuid(),
        applicationDate: new Date(),
        caseData: {
            transferDetails: transferDetails,
            bankDetails: {
                beneficiaryBank: {
                    bankName: "stanbic bank",
                    accountNumber: faker.finance.account(),
                    swiftCode: "sbicugkx",
                    sortCode: "12-34-56",
                    aba: "0260-0959-3",
                    fedWire: "152307768324",
                    ifsc: "icic0001359",
                    iban: faker.finance.iban(),
                },
                correspondentBankDetails: {
                    bankName: "Some bank",
                    accountNumber: faker.finance.account(),
                    swiftCode: "sbicugkx",
                    sortCode: "12-34-56",
                    aba: "0260-0959-3",
                    fedWire: "152307768324",
                    ifsc: "icic0001359",
                    iban: faker.finance.iban(),
                    transferPurpose: "college tuition",
                    charges: {
                        applicant: true,
                        beneficiary: false,
                        amount: 5,
                    },
                },
            },
            senderDetails: sender,
            metaData: {},
            user: {
                id: "1f824a84-46b6-4e7f-b601-5d041118439d",
                name: "Daniel Comboni",
                phone: "256781750721",
                agentCode: "2345566",
                branchName: "02",
                region: "GKLA",
            },
        },
    };
};
