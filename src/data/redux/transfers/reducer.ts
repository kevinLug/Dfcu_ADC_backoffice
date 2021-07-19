import {
    IApplicantDetails, IApplicantDetailsDefault,
    IBankDetails,
    IBankDetailsDefault,
    IBeneficiaryAddress,
    IBeneficiaryAddressDefault,
    IBeneficiaryBank,
    IBeneficiaryBankDefault,
    IBeneficiaryDetails,
    IBeneficiaryDetailsDefault,
    ICase,
    ICaseData,
    ICaseDataDefault,
    ICaseDefault,
    ISenderDetails,
    ISenderDetailsDefault,
    ITransferDetails,
    ITransferDetailsDefault
} from "../../../modules/transfers/types";

export const transferConstants = {
    startScan: "START_SCAN"
}

export interface ICaseState {
    aCase: ICase;
    caseData: ICaseData;
    applicantDetails: IApplicantDetails;
    transferDetails: ITransferDetails;
    // beneficiaryAddress: IBeneficiaryAddress;
    beneficiaryDetails: IBeneficiaryDetails;
    bankDetails: IBankDetails
}

export const initialState: ICaseState = {
    aCase: ICaseDefault,
    caseData: ICaseDataDefault,
    applicantDetails: IApplicantDetailsDefault,
    transferDetails: ITransferDetailsDefault,
    // beneficiaryAddress: IBeneficiaryAddressDefault,
    beneficiaryDetails: IBeneficiaryDetailsDefault,
    bankDetails: IBankDetailsDefault
}

export const actionICaseState = (aCase: ICase) => {
    return {
        type: transferConstants.startScan,
        payload: aCase
    }
}

export const reducer = (state = initialState, action: any): ICaseState => {
    const aCase = action.payload
    switch (action.type) {
        case transferConstants.startScan:
            return {
                ...state,
                aCase: aCase,
                caseData: aCase.caseData,
                applicantDetails: aCase.caseData.applicantDetails,
                transferDetails: aCase.caseData.transferDetails,
                // beneficiaryAddress: aCase.caseData.transferDetails.beneficiaryAddress,
                bankDetails: aCase.caseData.bankDetails,
                beneficiaryDetails: aCase.caseData.beneficiaryDetails
            }
        default: {
            return state;
        }
    }
}