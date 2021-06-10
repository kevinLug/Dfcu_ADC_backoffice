import {IKeyValueMap, KeyValueMap} from "../../utils/collections/map";
import {string} from "yup";





export interface IBeneficiaryAddress {
    country: string;
    town: string;
    plot: string;
    building: string;
    physicalAddress: string
}

export const IBeneficiaryAddressDefault = {} as IBeneficiaryAddress


export interface ITransferDetails {
    branchCode: string,
    remittanceType: string,
    currencyCode: string,
    transactionAmount: number,
    remittanceAmount: string,
    exchangeRate: number,
    amountInWords: string,
    transferPurpose: string
    // beneficiaryAddress: IBeneficiaryAddress;
}

export const ITransferDetailsDefault = <ITransferDetails>{
    // beneficiaryAddress: IBeneficiaryAddressDefault
}


export interface IApplicantBank {
    branchCode: string;
}

export interface IBeneficiaryBank {
    bankName: string;
    swiftCode: string;
    sortCode: string;
    aba: string;
    fedwire: string;
    ifsc: string;
    iban: string;
}

export interface IBeneficiaryAddress {
    town: string;
    countryCode: string;
    physicalAddress: string;
}

export interface IBeneficiaryDetails {
    fullName: string;
    accountNumber: string;
    address: IBeneficiaryAddress;
}


export const IBeneficiaryDetailsDefault: IBeneficiaryDetails = <IBeneficiaryDetails>{
    address: IBeneficiaryAddressDefault
}

export interface IApplicantAddress {
    plotNumber: string;
    street: string;
    town: string;
    district: string;
}

export const IApplicantAddressDefault: IApplicantAddress = <IApplicantAddress>{}

export interface IApplicantDetails {
    fullName: string;
    accountNumber: string;
    chequeNumber: string;
    emailAddress: string;
    phoneNumber: string;
    natureOfBusiness: string;
    address: IApplicantAddress;
}

export const IApplicantDetailsDefault: IApplicantDetails = <IApplicantDetails>{
    address: IApplicantAddressDefault
}

export const IBeneficiaryBankDefault: IBeneficiaryBank = <IBeneficiaryBank>{}



export interface ICharges {
    chargeMode: string;
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


export interface IApplicantBank {
    branchCode: string;
}

export interface ICharges {
    chargeMode: string;
}

export interface IBankDetails {
    beneficiaryBank: IBeneficiaryBank;
    correspondingBankDetails: ICorrespondingBankDetails;
    applicantBank: IApplicantBank;
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

// export interface IApplicantAddress {
//     plotNumber: string;
//     street: string;
//     town: string;
//     district: string;
// }
//
// export const IApplicantAddressDefault: IApplicantAddress = <IApplicantAddress
//
// export interface IApplicantDetails {
//     fullName: string;
//     accountNumber: string;
//     chequeNumber: string;
//     emailAddress: string;
//     phoneNumber: string;
//     natureOfBusiness: string;
//
// }

export interface ICaseData {
    transferDetails: ITransferDetails;
    bankDetails: IBankDetails;
    senderDetails: ISenderDetails;
    beneficiaryDetails: IBeneficiaryDetails;
    applicantDetails: IApplicantDetails;
    charges: ICharges;
    user: IUser;
    doc: any
}

export const ICaseDataDefault: ICaseData = <ICaseData>{
    applicantDetails: IApplicantDetailsDefault
}

export interface ICase {
    applicationDate: Date;
    workflowType: string;
    externalReference: string;
    referenceNumber: number;
    caseData: ICaseData;

}

export const ICaseDefault: ICase = <ICase>{
    // caseData: ICaseDataDefault
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