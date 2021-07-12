import {
    IApplicantDetails, IBankDetails,
    IBeneficiaryAddress,
    IBeneficiaryBank,
    IBeneficiaryDetails, ICase,

    ITransferDetails
} from "./types";

import {KeyValueMap} from "../../utils/collections/map";
import {printDateTime} from "../../utils/dateHelpers";
import {ConstantLabelsAndValues} from "../../data/constants";

interface ILabelValue {
    label: string;
    value: any;
}

const keyValueLabels = (labelsAndValues: ILabelValue[]) => {
    const keyValue = new KeyValueMap<string, any>();
    labelsAndValues.map(e => keyValue.put(e.label, e.value));
    return keyValue;
}

export const transferDetailsLabels = (transferDetails: ITransferDetails, aCase: ICase) => {
    const labelling = transferDetails

    const labels: ILabelValue[] = [
        {
            label: ConstantLabelsAndValues.DATE,
            value: printDateTime(aCase.applicationDate)
        },
        {
            label: ConstantLabelsAndValues.REQUESTING_BRANCH,
            value: labelling.branchCode
        },
        {
            label: ConstantLabelsAndValues.TRANSFER_TYPE,
            value: aCase.workflowType
        },
        {
            label: ConstantLabelsAndValues.CURRENCY,
            value: labelling.currencyCode
        },
        {
            label: ConstantLabelsAndValues.AMOUNT,
            value: labelling.remittanceAmount
        },
        {
            label: ConstantLabelsAndValues.AMOUNT_IN_WORDS,
            value: labelling.amountInWords
        },
        {
            label: ConstantLabelsAndValues.RATE,
            value: labelling.exchangeRate
        },
        {
            label: ConstantLabelsAndValues.REMITTANCE_AMOUNT,
            value: labelling.transactionAmount
        },
        {
            label: ConstantLabelsAndValues.PURPOSE_OF_TRANSFER,
            value: labelling.transferPurpose
        }

        // {
        //     label: 'Beneficiary Country',
        //     value: labelling.beneficiaryAddress.country
        // },
        // {
        //     label: 'Beneficiary Town',
        //     value: labelling.beneficiaryAddress.town
        // },
        // {
        //     label: 'Beneficiary Plot',
        //     value: labelling.beneficiaryAddress.plot
        // },
        // {
        //     label: 'Beneficiary Building',
        //     value: labelling.beneficiaryAddress.building
        // },
    ]

    console.log("labels:", labels)

    return keyValueLabels(labels);
}


export const beneficiaryDetailsLabels = (dataOne: IBeneficiaryDetails, dataTwo: IBankDetails) => {
    const labellingOne = {...dataOne}
    const labellingTwo = {...dataTwo}
    let transferCode = ''
    let transferCodesLabel = ''

    for (const [k, v] of Object.entries(labellingTwo.beneficiaryBank)) {

        if (k !== 'bankName' && v !== null && v !== undefined && v !== '') {
            transferCode = v

            switch (k) {
                case 'sortCode':
                    transferCodesLabel = ConstantLabelsAndValues.SORT_CODE
                    break
                case 'swiftCode':
                    transferCodesLabel = ConstantLabelsAndValues.SWIFT_CODE
                    break
                case 'aba':
                    transferCodesLabel = ConstantLabelsAndValues.ABA
                    break
                case 'fedwire':
                    transferCodesLabel = ConstantLabelsAndValues.FED_WIRE
                    break
                case 'ifsc':
                    transferCodesLabel = ConstantLabelsAndValues.IFSC
                    break
                case 'iban':
                    transferCodesLabel = ConstantLabelsAndValues.IBAN
                    break

            }

        }
    }

    let recipientPhysicalAddress = ''
    for (const [k, v] of Object.entries(labellingOne.address)) {
        if (v !== null && v !== undefined && v !== '' && k !== 'countryCode') {
            console.log('k:', k, v)
            recipientPhysicalAddress = (v).concat(`,${recipientPhysicalAddress}`)
        }
    }

    const labels = [
        {
            label: ConstantLabelsAndValues.NAME,
            value: labellingOne.fullName
        },
        {
            label: ConstantLabelsAndValues.BANK_NAME,
            value: labellingTwo.beneficiaryBank.bankName
        },
        {
            label: ConstantLabelsAndValues.ACCOUNT_NO,
            value: labellingOne.accountNumber
        },
        {
            label: transferCodesLabel,
            value: transferCode
        },
        {
            label: ConstantLabelsAndValues.COUNTRY,
            value: labellingOne.address.country
        },
        {
            label: ConstantLabelsAndValues.COUNTRY_CODE,
            value: labellingOne.address.countryCode
        },
        {
            label: ConstantLabelsAndValues.TOWN,
            value: labellingOne.address.town
        },
        // {
        //     label: 'Physical Address',
        //     value: labellingOne.address.physicalAddress
        // },
        {
            label: ConstantLabelsAndValues.PLOT,
            value: labellingOne.address.plot
        },
        {
            label: ConstantLabelsAndValues.BUILDING,
            value: labellingOne.address.building
        },
        {
            label: ConstantLabelsAndValues.PHYSICAL_ADDRESS,
            value: recipientPhysicalAddress
        }
    ];

    return keyValueLabels(labels);
}

export const beneficiaryAddressLabels = (data: IBeneficiaryAddress) => {
    const labelling = data
    const labels = [
        {
            label: ConstantLabelsAndValues.COUNTRY,
            value: labelling.country
        },
        {
            label: ConstantLabelsAndValues.TOWN,
            value: labelling.town
        },
        {
            label: ConstantLabelsAndValues.PLOT,
            value: labelling.plot
        },
        {
            label: ConstantLabelsAndValues.BUILDING,
            value: labelling.building
        }
    ];

    return keyValueLabels(labels);
}

export const beneficiaryBankLabels = (data: IBeneficiaryBank) => {
    const labelling = data
    const labels: ILabelValue[] = [
        {
            label: ConstantLabelsAndValues.BENEFICIARY_BANK,
            value: labelling.bankName
        },
        {
            label: ConstantLabelsAndValues.ABA,
            value: labelling.aba
        },
        {
            label: ConstantLabelsAndValues.FED_WIRE,
            value: labelling.fedwire
        },
        {
            label: ConstantLabelsAndValues.SORT_CODE,
            value: labelling.sortCode
        },
        {
            label: ConstantLabelsAndValues.SWIFT_CODE,
            value: labelling.swiftCode
        },
        {
            label: ConstantLabelsAndValues.IBAN,
            value: labelling.iban
        },
        {
            label: ConstantLabelsAndValues.IFSC,
            value: labelling.ifsc
        },
    ]
    return keyValueLabels(labels);
}

// export const correspondingBankDetailsLabels = () => {
//     const labelling = <ICorrespondingBankDetails>{}
//     const labels: ILabelValue[] = [
//         {
//             label: 'Correspondent Bank',
//             value: labelling.bankName
//         },
//         {
//             label: 'Correspondent Bank A/C No.',
//             value: labelling.accountNumber
//         },
//         {
//             label: 'Correspondent Bank Swift Code',
//             value: labelling.swiftCode
//         },
//         {
//             label: 'Correspondent Bank Sort Code',
//             value: labelling.sortCode
//         },
//         {
//             label: 'Correspondent Bank ABA',
//             value: labelling.aba
//         },
//         {
//             label: 'Correspondent Bank Fed wire',
//             value: labelling.fedWire
//         },
//         {
//             label: 'Correspondent Bank IFSC',
//             value: labelling.ifsc
//         },
//         {
//             label: 'Transfer purpose',
//             value: labelling.transferPurpose
//         },
//         // {
//         //     label: 'Sender charge', // this should automatically negate the beneficiary charge or else remove one of them
//         //     value: labelling.charges.applicant
//         // },
//
//     ]
//     return keyValueLabels(labels);
// }

export const applicationDetailsLabels = (data: IApplicantDetails) => {
    const labelling = data
    const labels: ILabelValue[] = [
        {
            label: ConstantLabelsAndValues.NAME,
            value: labelling.fullName
        },
        {
            label: ConstantLabelsAndValues.ACCOUNT_NO,
            value: labelling.accountNumber
        },
        {
            label: ConstantLabelsAndValues.TELEPHONE,
            value: labelling.phoneNumber
        },
        {
            label: ConstantLabelsAndValues.EMAIL,
            value: labelling.emailAddress
        },
        {
            label: ConstantLabelsAndValues.NATURE_OF_BUSINESS,
            value: labelling.natureOfBusiness
        },
        {
            label: ConstantLabelsAndValues.CHEQUE_NO,
            value: labelling.chequeNumber
        },
        // {
        //     label: 'District',
        //     value: labelling.address.district
        // },
        // {
        //     label: 'Town',
        //     value: labelling.address.town
        // },
        // {
        //     label: 'Street',
        //     value: labelling.address.street
        // },
        // {
        //     label: 'Plot No.',
        //     value: labelling.address.plotNumber
        // },
        {
            label: ConstantLabelsAndValues.PHYSICAL_ADDRESS,
            value: `${labelling.address.district},${labelling.address.town}, ${labelling.address.street}, ${labelling.address.plotNumber}`
        }
    ];
    return keyValueLabels(labels)
}
