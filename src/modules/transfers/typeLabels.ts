import {
    IApplicantDetails,
    IBeneficiaryAddress,
    IBeneficiaryBank,
    IBeneficiaryDetails,
    ICorrespondingBankDetails, ISenderDetails,
    ITransferDetails
} from "./types";
import {string} from "yup";
import {KeyValueMap} from "../../utils/collections/map";

interface ILabelValue {
    label: string;
    value: any;
}

const keyValueLabels = (labelsAndValues: ILabelValue[]) => {
    const keyValue = new KeyValueMap<string, any>();
    labelsAndValues.map(e => {
        keyValue.put(e.label, e.value);
    });
    return keyValue;
}

export const transferDetailsLabels = (transferDetails: ITransferDetails) => {
    const labelling = transferDetails
    const labels: ILabelValue[] = [
        {
            label: 'Branch',
            value: labelling.branchCode
        },
        {
            label: 'Rate',
            value: labelling.exchangeRate
        },
        {
            label: 'Currency',
            value: labelling.currencyCode
        },
        {
            label: 'Amount',
            value: labelling.remittanceAmount
        },
        {
            label: 'UGX Amount',
            value: labelling.transactionAmount
        },
        {
            label: 'Amount in words',
            value: labelling.amountInWords
        },
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

    return keyValueLabels(labels);
}


export const beneficiaryDetailsLabels = (data: IBeneficiaryDetails) => {
    const labelling = data
    const labels = [
        {
            label: 'Full Name',
            value: labelling.fullName
        },
        {
            label: 'A/C No.',
            value: labelling.accountNumber
        },
        {
            label: 'Country',
            value: labelling.address.country
        },
        {
            label: 'Country Code',
            value: labelling.address.countryCode
        },
        {
            label: 'Town',
            value: labelling.address.town
        },
        {
            label: 'Physical Address',
            value: labelling.address.physicalAddress
        },
        {
            label: 'Plot',
            value: labelling.address.plot
        },
        {
            label: 'Building',
            value: labelling.address.building
        }
    ];

    return keyValueLabels(labels);
}

export const beneficiaryAddressLabels = (data: IBeneficiaryAddress) => {
    const labelling = data
    const labels = [
        {
            label: 'Country',
            value: labelling.country
        },
        {
            label: 'Town',
            value: labelling.town
        },
        {
            label: 'Plot',
            value: labelling.plot
        },
        {
            label: 'Building',
            value: labelling.building
        }
    ];

    return keyValueLabels(labels);
}

export const beneficiaryBankLabels = (data: IBeneficiaryBank) => {
    const labelling = data
    const labels: ILabelValue[] = [
        {
            label: 'Beneficiary Bank',
            value: labelling.bankName
        },
        {
            label: 'ABA',
            value: labelling.aba
        },
        {
            label: 'Fed-wire',
            value: labelling.fedwire
        },
        {
            label: 'Sort code',
            value: labelling.sortCode
        },
        {
            label: 'Swift code',
            value: labelling.swiftCode
        },
        {
            label: 'IBAN',
            value: labelling.iban
        },
        {
            label: 'IFSC',
            value: labelling.ifsc
        },
    ]
    return keyValueLabels(labels);
}

export const correspondingBankDetailsLabels = () => {
    const labelling = <ICorrespondingBankDetails>{}
    const labels: ILabelValue[] = [
        {
            label: 'Correspondent Bank',
            value: labelling.bankName
        },
        {
            label: 'Correspondent Bank A/C No.',
            value: labelling.accountNumber
        },
        {
            label: 'Correspondent Bank Swift Code',
            value: labelling.swiftCode
        },
        {
            label: 'Correspondent Bank Sort Code',
            value: labelling.sortCode
        },
        {
            label: 'Correspondent Bank ABA',
            value: labelling.aba
        },
        {
            label: 'Correspondent Bank Fed wire',
            value: labelling.fedWire
        },
        {
            label: 'Correspondent Bank IFSC',
            value: labelling.ifsc
        },
        {
            label: 'Transfer purpose',
            value: labelling.transferPurpose
        },
        // {
        //     label: 'Sender charge', // this should automatically negate the beneficiary charge or else remove one of them
        //     value: labelling.charges.applicant
        // },

    ]
    return keyValueLabels(labels);
}

export const applicationDetailsLabels = (data: IApplicantDetails) => {
    const labelling = data
    const labels: ILabelValue[] = [
        {
            label: 'Name',
            value: labelling.fullName
        },
        {
            label: 'Email',
            value: labelling.emailAddress
        },
        {
            label: 'A/C No.',
            value: labelling.accountNumber
        },
        {
            label: 'Telephone',
            value: labelling.phoneNumber
        },
        {
            label: 'Nature of Business',
            value: labelling.natureOfBusiness
        },
        {
            label: 'Cheque No.',
            value: labelling.chequeNumber
        },
        {
            label: 'District',
            value: labelling.address.district
        },
        {
            label: 'Town',
            value: labelling.address.town
        },
        {
            label: 'Street',
            value: labelling.address.street
        },
        {
            label: 'Plot No.',
            value: labelling.address.plotNumber
        },
    ];
    return keyValueLabels(labels)
}
