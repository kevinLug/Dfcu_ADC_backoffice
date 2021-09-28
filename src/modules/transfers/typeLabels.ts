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
import {RequestType} from "../workflows/config";
import ObjectHelpersFluent, {fluentValidationInstance} from "../../utils/objectHelpersFluent";
import {isNullOrEmpty, isNullOrUndefined, removeLastComma} from "../../utils/objectHelpers";

import Numbers from "../../utils/numbers";

interface ILabelValue {
    label: string;
    value: any;
}

const keyValueLabels = (labelsAndValues: ILabelValue[]) => {
    const keyValue = new KeyValueMap<string, any>();
    labelsAndValues.map(e => keyValue.put(e.label, e.value));
    return keyValue;
}

const zeroBasedNumberPlaceHolderDeterminant = (value: number): string => {
    if (value > 0){
        return Numbers.format_En_UK(value)
    }
    return ''
}

export const transferDetailsLabels = (transferDetails: ITransferDetails, aCase: ICase, forexDetails: IForex) => {
    const labelling = transferDetails

    let branchCode: string = ''

    let dateStr: any
    if (isNullOrUndefined(aCase.workflowType) || isNullOrEmpty(aCase.workflowType)){
        dateStr = ''
    }else
        dateStr = printDateTime(aCase.applicationDate)

    const labels: ILabelValue[] = [
        {
            label: ConstantLabelsAndValues.DATE,
            value: dateStr
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
            value: zeroBasedNumberPlaceHolderDeterminant(labelling.transactionAmount)
        },
        {
            label: ConstantLabelsAndValues.AMOUNT_IN_WORDS,
            value: labelling.amountInWords
        },

        {
            label: ConstantLabelsAndValues.RATE_PROVIDED_BY_CUSTOMER,
            value: zeroBasedNumberPlaceHolderDeterminant(labelling.rate)
        },
        {
            label: ConstantLabelsAndValues.RATE_PROVIDED_BY_BANK_USER,
            value: zeroBasedNumberPlaceHolderDeterminant(forexDetails.rate)
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

    return keyValueLabels(labels);
}


export const beneficiaryDetailsLabels = (dataOne: IBeneficiaryDetails, dataTwo: IBankDetails, aCase: ICase) => {
    const labellingOne = {...dataOne}
    const labellingTwo = {...dataTwo}

    let recipientPhysicalAddress = '';

    // @ts-ignore
    let bankName = ''
    let bankNameNotPresent = ''

    const transferCodesAndLabels: any[] = []
    const addCodeAndLabel = (label: string, value: string) => {
        transferCodesAndLabels.push({label, value})
    }

    function allTransferCodes(): any[] {

                if (!isNullOrEmpty(labellingTwo.beneficiaryBank.swiftCode))
                    addCodeAndLabel(ConstantLabelsAndValues.SWIFT_CODE, labellingTwo.beneficiaryBank.swiftCode);
                // add iban
                if (!isNullOrEmpty(labellingTwo.beneficiaryBank.iban))
                    addCodeAndLabel(ConstantLabelsAndValues.IBAN, labellingTwo.beneficiaryBank.iban);
                // add aba
                if (!isNullOrEmpty(labellingTwo.beneficiaryBank.aba))
                    addCodeAndLabel(ConstantLabelsAndValues.ABA, labellingTwo.beneficiaryBank.aba);
                // add ifsc
                if (!isNullOrEmpty(labellingTwo.beneficiaryBank.ifsc))
                    addCodeAndLabel(ConstantLabelsAndValues.IFSC, labellingTwo.beneficiaryBank.ifsc);
                // add fed wire
                if (!isNullOrEmpty(labellingTwo.beneficiaryBank.fedwire))
                    addCodeAndLabel(ConstantLabelsAndValues.FED_WIRE, labellingTwo.beneficiaryBank.fedwire);
                // add sort code
                if (!isNullOrEmpty(labellingTwo.beneficiaryBank.sortCode))
                    addCodeAndLabel(ConstantLabelsAndValues.IBAN, labellingTwo.beneficiaryBank.sortCode);

        return transferCodesAndLabels
    }


    const labels = [
        {
            label: ConstantLabelsAndValues.NAME,
            value: labellingOne.fullName
        },
        {
            label: ConstantLabelsAndValues.BANK_NAME,
            value: fluentValidationInstance()
                .testTitle("CASE is present")
                .selector(aCase, '$')
                .isPresent()
                .successCallBack(() => {

                    fluentValidationInstance()
                        .testTitle('transfer type is not empty..for bank name display')
                        .selector(aCase, '$.workflowType')
                        .isPresent()
                        .successCallBack(() => {

                            const eftOrRtgs1 = aCase.workflowType === RequestType.EFT || aCase.workflowType === RequestType.RTGS_1

                            // EFT or RTGS1 transfer type
                            fluentValidationInstance()
                                .testTitle("transfer type equals EFT or RTGS_1")
                                .directValue(eftOrRtgs1)
                                .isEqualTo(true)
                                .successCallBack(() => {

                                    if (!isNullOrUndefined(labellingTwo.beneficiaryBank.bankName) && !isNullOrEmpty(labellingTwo.beneficiaryBank.bankName)) {
                                        // @ts-ignore
                                        bankName = ConstantLabelsAndValues.mapOfRecipientBankCodeToValueOfBank().get(labellingTwo.beneficiaryBank.bankName).name
                                    }

                                })
                                .failureCallBack(() => {
                                    if (!isNullOrUndefined(labellingTwo.beneficiaryBank.bankName) && !isNullOrEmpty(labellingTwo.beneficiaryBank.bankName)) {
                                        bankName = labellingTwo.beneficiaryBank.bankName
                                    }

                                })
                        })

                })
                .getSummary().testResult ? bankName : bankNameNotPresent
        },
        {
            label: ConstantLabelsAndValues.ACCOUNT_NO,
            value: labellingOne.accountNumber
        },

        ...allTransferCodes(),

        {
            label: ConstantLabelsAndValues.PHYSICAL_ADDRESS,

            value: fluentValidationInstance().directValue(labellingOne.address).isPresent().failureCallBack(() => recipientPhysicalAddress = '')

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

                }).failureCallBack(() => recipientPhysicalAddress = '').getSummary().testResult ? removeLastComma(recipientPhysicalAddress) : recipientPhysicalAddress
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
        {
            label: ConstantLabelsAndValues.PLOT,
            value: labellingOne.address.plot
        },
        {
            label: ConstantLabelsAndValues.BUILDING,
            value: labellingOne.address.building
        },

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

        {
            label: ConstantLabelsAndValues.PHYSICAL_ADDRESS,
            value: physicalAddress
        }
    ];
    return keyValueLabels(labels)
}
