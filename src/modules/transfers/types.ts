import {IKeyValueMap, KeyValueMap} from "../../utils/collections/map";

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

export interface IBeneficiaryAddress {
    country: string;
    town: string;
    plot: string;
    building: string;
    physicalAddress: string
}

export const IBeneficiaryAddressDefault = {} as IBeneficiaryAddress

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

export interface ITransferDetails {
    branch: string;
    rate: number;
    currency: string;
    amount: number;
    ugxAmount: number;
    amountInWords: string;
    beneficiaryName: string;
    beneficiaryAddress: IBeneficiaryAddress;
}

export const ITransferDetailsDefault = <ITransferDetails>{
    beneficiaryAddress: IBeneficiaryAddressDefault
}

export const transferDetailsLabels = (transferDetails: ITransferDetails) => {
    const labelling = transferDetails
    const labels: ILabelValue[] = [
        {
            label: 'Branch',
            value: labelling.branch
        },
        {
            label: 'Rate',
            value: labelling.rate
        },
        {
            label: 'Currency',
            value: labelling.currency
        },
        {
            label: 'Amount',
            value: labelling.amount
        },
        {
            label: 'UGX Amount',
            value: labelling.ugxAmount
        },
        {
            label: 'Amount in words',
            value: labelling.amountInWords
        },
        {
            label: 'Beneficiary Name',
            value: labelling.beneficiaryName
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

export interface IBeneficiaryBank {
    bankName: string;
    accountNumber: string;
    swiftCode: string;
    sortCode: string;
    aba: string;
    fedWire: string;
    ifsc: string;
    iban: string;
}

export const IBeneficiaryBankDefault: IBeneficiaryBank = <IBeneficiaryBank>{}

export const beneficiaryBankLabels = (data: IBeneficiaryBank) => {
    const labelling = data
    const labels: ILabelValue[] = [
        {
            label: 'Beneficiary Bank',
            value: labelling.bankName
        },
        {
            label: 'Beneficiary A/C No.',
            value: labelling.accountNumber
        },
        {
            label: 'Beneficiary Bank Swift Code',
            value: labelling.swiftCode
        },
        {
            label: 'Beneficiary Bank Sort Code',
            value: labelling.sortCode
        },
        {
            label: 'Beneficiary Bank ABA',
            value: labelling.aba
        },
        {
            label: 'Beneficiary Fed wire',
            value: labelling.fedWire
        },
        {
            label: 'Beneficiary IFSC',
            value: labelling.ifsc
        },
        {
            label: 'Beneficiary Bank IBAN',
            value: labelling.iban
        },
    ]
    return keyValueLabels(labels);
}

export interface ICharges {
    applicant: boolean;
    beneficiary: boolean;
    amount: number;
}

export const IChargesDefault: ICharges = <ICharges>{}

export interface ICorrespondingBankDetails {
    bankName: string;
    accountNumber: string;
    swiftCode: string;
    sortCode: string;
    aba: string;
    fedWire: string;
    ifsc: string;
    iban: string;
    transferPurpose: string;
    charges: ICharges;
}

export const ICorrespondingBankDetailsDefault: ICorrespondingBankDetails = <ICorrespondingBankDetails>{
    charges: IChargesDefault
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
        {
            label: 'Sender charge', // this should automatically negate the beneficiary charge or else remove one of them
            value: labelling.charges.applicant
        },

    ]
    return keyValueLabels(labels);
}

export interface IPhysicalAddress {
    plotNumber: string;
    street: string;
    town: string;
    district: string;
    signatureOfMandate: string;
}

export const IPhysicalAddressDefault: IPhysicalAddress = <IPhysicalAddress>{}

export interface ISenderDetails {
    name: string;
    email: string;
    accountNumber: string;
    telephone: string;
    natureOfBusiness: string;
    chequeNumber: string;
    physicalAddress: IPhysicalAddress;
}

export const ISenderDetailsDefault: ISenderDetails = <ISenderDetails>{
    physicalAddress: IPhysicalAddressDefault
}

export const senderDetailsLabels = (data: ISenderDetails) => {
    const labelling = data
    const labels: ILabelValue[] = [
        {
            label: 'Name',
            value: labelling.name
        },
        {
            label: 'Email',
            value: labelling.email
        },
        {
            label: 'A/C No.',
            value: labelling.accountNumber
        },
        {
            label: 'Telephone',
            value: labelling.telephone
        },
        {
            label: 'Sender Nature of Business',
            value: labelling.natureOfBusiness
        },
        {
            label: 'Cheque No.',
            value: labelling.chequeNumber
        },
        {
            label: 'District',
            value: labelling.physicalAddress.district
        },
        {
            label: 'Town',
            value: labelling.physicalAddress.town
        },
        {
            label: 'Street',
            value: labelling.physicalAddress.street
        },
        {
            label: 'Plot No.',
            value: labelling.physicalAddress.plotNumber
        },
    ];
    return keyValueLabels(labels)
}

export interface IBankDetails {
    beneficiaryBank: IBeneficiaryBank;
    correspondingBankDetails: ICorrespondingBankDetails
}

export const IBankDetailsDefault: IBankDetails = <IBankDetails>{
    beneficiaryBank: IBeneficiaryBankDefault
}

export interface IUser {
    id: string;
    name: string;
    phone: string;
    agentCode: string;
    branchName: string;
    region: string;
}

export const IUserDefault: IUser = <IUser>{}

export interface ICaseData {
    transferDetails: ITransferDetails;
    bankDetails: IBankDetails;
    senderDetails: ISenderDetails;
    user: IUser
}

export const ICaseDataDefault: ICaseData = <ICaseData>{}

export interface ICase {
    applicationDate: string;
    workflowType: string;
    externalReference: string;
    referenceNumber: number;
    caseData: ICaseData;
}

export const ICaseDefault: ICase = <ICase>{
    caseData: ICaseDataDefault
}

export interface IWorkflowResponseMessage {
    status: string;
    caseId: string;
    subStatus: string;
    message: string;
}

export const IWorkflowResponseMessageDefault: IWorkflowResponseMessage = <IWorkflowResponseMessage>{}

export interface ITemplateTempProps {
    caseData: ICaseData;
    applicationDate?: string;
    workflowType?: string;
    externalReference?: string;
    referenceNumber?: number;

}

export interface ICheckKeyValue {
    checks: IKeyValueMap<string, boolean>
}

export const ICheckKeyValueDefault: ICheckKeyValue = <ICheckKeyValue>{
    checks: new KeyValueMap<string, boolean>()
}

export class Case implements ICase {
    // @ts-ignore
    date: string;
    // @ts-ignore
    caseData: ICaseData;
    // @ts-ignore
    referenceNumber: number;
    // @ts-ignore
    type: string;
    // @ts-ignore
    applicationDate: string;
    // @ts-ignore
    externalReference: string;
    // @ts-ignore
    workflowType: string;


}