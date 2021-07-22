import {
    IApplicantDetails, IBankDetails,
    IBeneficiaryAddress,
    IBeneficiaryBank,
    IBeneficiaryDetails, ICase, IForex,

    ITransferDetails
} from "./types";

import {KeyValueMap} from "../../utils/collections/map";
import {printDateTime} from "../../utils/dateHelpers";
import {ConstantLabelsAndValues} from "../../data/constants";
import {RequestType, workflowTypes} from "../workflows/config";
import ObjectHelpersFluent from "../../utils/objectHelpersFluent";
import {isNullOrEmpty} from "../../utils/objectHelpers";
import validate from "validate.js";

interface ILabelValue {
    label: string;
    value: any;
}

const keyValueLabels = (labelsAndValues: ILabelValue[]) => {
    const keyValue = new KeyValueMap<string, any>();
    labelsAndValues.map(e => keyValue.put(e.label, e.value));
    return keyValue;
}

export const transferDetailsLabels = (transferDetails: ITransferDetails, aCase: ICase, forexDetails: IForex) => {
    const labelling = transferDetails

    // ConstantLabelsAndValues.mapOfDFCUBranchCodeToBranchLabel().get(labelling.branchCode)
    //
    // console.log('flag:', new ObjectHelpersFluent().directValue(labelling.branchCode).isPresent().getFlag())
    // console.log('flag:', new ObjectHelpersFluent().directValue(labelling.branchCode).isPresent().getSummary().testResult)
    // new ObjectHelpersFluent().directValue(labelling.branchCode).isPresent()
    //     .logDetailed()
    //     .successCallBack(() => {
    //
    //         new ObjectHelpersFluent().directValue(labelling.branchCode).isPresent()
    //
    //             .successCallBack(() => {
    //
    //                 // branchCode = ConstantLabelsAndValues.mapOfDFCUBranchCodeToBranchLabel().get(labelling.branchCode)
    //
    //             })
    //
    //
    //     })
    //
    // new ObjectHelpersFluent().directValue(printDateTime(aCase.applicationDate)).isEqualTo(printDateTime(new Date())).logDetailed()
    //     .successCallBack(() => date = '').failureCallBack(() => date = aCase.applicationDate).getSummary().testResult ? date : printDateTime(date)

    // new ObjectHelpersFluent().directValue(labelling.remittanceAmount).isPresent()
    //     .successCallBack(() => remittanceAmount = labelling.remittanceAmount)
    //     .failureCallBack(() => remittanceAmount = labelling.transactionAmount.toString())
    //     .getSummary().testResult ? remittanceAmount : remittanceAmount


    let date: any = ''
    let branchCode: string = ''
    let remittanceAmount = ''
    const labels: ILabelValue[] = [
        {
            label: ConstantLabelsAndValues.DATE,
            value: printDateTime(aCase.applicationDate)
        },
        {
            label: ConstantLabelsAndValues.REQUESTING_BRANCH,
            value: new ObjectHelpersFluent().directValue(labelling.branchCode).isPresent()

                .successCallBack(() => {

                    new ObjectHelpersFluent().directValue(labelling.branchCode).isPresent()

                        .successCallBack(() => {

                            // @ts-ignore
                            branchCode = ConstantLabelsAndValues.mapOfDFCUBranchCodeToBranchLabel().get(labelling.branchCode)

                        })


                }).failureCallBack(() => {
                    branchCode = ''
                }).getSummary().testResult ? branchCode : branchCode
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
            value: labelling.transactionAmount
        },
        {
            label: ConstantLabelsAndValues.AMOUNT_IN_WORDS,
            value: labelling.amountInWords
        },
        {
            label: ConstantLabelsAndValues.RATE,
            value: forexDetails.rate
        },
        {
            label: ConstantLabelsAndValues.REMITTANCE_AMOUNT,
            value: forexDetails.remittanceAmount
        },
        {
            label: ConstantLabelsAndValues.PURPOSE_OF_TRANSFER,
            value: labelling.transferPurpose
        }
        ,
        {
            label: ConstantLabelsAndValues.COUNTRY_CODE,
            value: labelling.currencyCode
        },

    ]

    // console.log("labels:", labels)
    const val = keyValueLabels(labels);
    // console.log("labels-after:", labels)
    return val
}

export const beneficiaryDetailsLabels = (dataOne: IBeneficiaryDetails, dataTwo: IBankDetails, aCase: ICase) => {
    const labellingOne = {...dataOne}
    const labellingTwo = {...dataTwo}
    console.log('eft:', labellingTwo)
    let transferCode = ''
    let transferCodesLabel = ''
    // console.log(labellingTwo, labellingOne)

    // for (const [k, v] of Object.entries(labellingTwo.beneficiaryBank)) {
    //
    //     if (k !== 'bankName' && v !== null && v !== undefined && v !== '') {
    //         transferCode = v
    //
    //         switch (k) {
    //             case 'sortCode':
    //                 transferCodesLabel = ConstantLabelsAndValues.SORT_CODE
    //                 break
    //             case 'swiftCode':
    //                 transferCodesLabel = ConstantLabelsAndValues.SWIFT_CODE
    //                 break
    //             case 'aba':
    //                 transferCodesLabel = ConstantLabelsAndValues.ABA
    //                 break
    //             case 'fedwire':
    //                 transferCodesLabel = ConstantLabelsAndValues.FED_WIRE
    //                 break
    //             case 'ifsc':
    //                 transferCodesLabel = ConstantLabelsAndValues.IFSC
    //                 break
    //             case 'iban':
    //                 transferCodesLabel = ConstantLabelsAndValues.IBAN
    //                 break
    //
    //         }
    //
    //     }
    // }

    let recipientPhysicalAddress = '';

    // @ts-ignore
    let bankName = ''
    let bankNameNotPresent = ''

    const labels = [
        {
            label: ConstantLabelsAndValues.NAME,
            value: labellingOne.fullName
        },
        {
            label: ConstantLabelsAndValues.BANK_NAME,
            value: new ObjectHelpersFluent().testTitle("CASE is present").directValue(aCase)
                .isPresent()

                .successCallBack(() => {

                    new ObjectHelpersFluent().testTitle('transfer type is not empty..for bank name display').selector(aCase, '$.workflowType')
                        .isPresent()

                        .successCallBack(() => {

                            const eftOrRtgs1 = aCase.workflowType === RequestType.EFT || aCase.workflowType === RequestType.RTGS_1

                            // EFT or RTGS1 transfer type
                            new ObjectHelpersFluent()
                                .testTitle("transfer type equals EFT")
                                .directValue(eftOrRtgs1).isEqualTo(true)

                                .successCallBack(() => {
                                    // @ts-ignore
                                    bankName = ConstantLabelsAndValues.mapOfRecipientBankCodeToValueOfBank().get(labellingTwo.beneficiaryBank.bankName).name
                                })
                                .failureCallBack(() => bankName = labellingTwo.beneficiaryBank.bankName)
                        })

                })
                .getSummary().testResult ? bankName : bankNameNotPresent
        },
        {
            label: ConstantLabelsAndValues.ACCOUNT_NO,
            value: labellingOne.accountNumber
        },
        // {
        //     label: transferCodesLabel,
        //     value: transferCode
        // },
        // {
        //     label: ConstantLabelsAndValues.COUNTRY,
        //     value: labellingOne.address.country
        // },
        // {
        //     label: ConstantLabelsAndValues.COUNTRY_CODE,
        //     value: labellingOne.address.countryCode
        // },
        // {
        //     label: ConstantLabelsAndValues.TOWN,
        //     value: labellingOne.address.town
        // },
        // {
        //     label: 'Physical Address',
        //     value: labellingOne.address.physicalAddress
        // },
        // {
        //     label: ConstantLabelsAndValues.PLOT,
        //     value: labellingOne.address.plot
        // },
        // {
        //     label: ConstantLabelsAndValues.BUILDING,
        //     value: labellingOne.address.building
        // },
        {
            label: ConstantLabelsAndValues.PHYSICAL_ADDRESS,

            value: new ObjectHelpersFluent().directValue(labellingOne.address).isPresent().failureCallBack(() => recipientPhysicalAddress = '')

                .successCallBack(() => {

                    const map = new KeyValueMap<string, string>()

                    for (const [k, v] of Object.entries(labellingOne.address)) {

                        if (v !== null && v !== undefined && v !== '') {

                            map.put(k, v)

                        }

                    }

                    for (const [k, v] of Object.entries(labellingOne.address)) {
                        if (map.containsKey(k)) {
                            if (k === 'countryCode') {
                                const c = ConstantLabelsAndValues.mapOfCountryCodeToCountryName().get(v)
                                // @ts-ignore
                                recipientPhysicalAddress = recipientPhysicalAddress.concat(c).concat(',')
                            } else
                                recipientPhysicalAddress = recipientPhysicalAddress.concat(v).concat(',')
                        }
                    }

                }).failureCallBack(() => recipientPhysicalAddress = '').getSummary().testResult ? recipientPhysicalAddress : recipientPhysicalAddress
        }
    ];

    return keyValueLabels(labels);
}

export const beneficiaryAddressLabels = (data: IBeneficiaryAddress) => {
    const labelling = data
    const labels = [
        {
            label: ConstantLabelsAndValues.COUNTRY,
            value: ConstantLabelsAndValues.mapOfCountryCodeToCountryName().get(labelling.country)
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

    let physicalAddress = `${labelling.address.district},${labelling.address.town}, ${labelling.address.street}, ${labelling.address.plotNumber}`;

    const physicalAddressSeparated = physicalAddress.split(",")

    const filtered = physicalAddressSeparated.filter((v) => {
        return v.trim() !== undefined && v.trim() !== 'undefined' && v.trim() !== ''
    })

    physicalAddress = filtered.join(",")

    const labels: ILabelValue[] = [
        {
            label: ConstantLabelsAndValues.NAME,
            value: labelling.fullName
        },
        {
            label: ConstantLabelsAndValues.ACCOUNT_NUMBER_FULL,
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
            value: physicalAddress
        }
    ];
    return keyValueLabels(labels)
}
