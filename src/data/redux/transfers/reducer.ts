import {
    IBankDetails,
    IBankDetailsDefault,
    IBeneficiaryAddress,
    IBeneficiaryAddressDefault, IBeneficiaryBank, IBeneficiaryBankDefault,
    ICase,
    ICaseData,
    ICaseDataDefault,
    ICaseDefault,
    ISenderDetails,
    ISenderDetailsDefault, ITransferDetails, ITransferDetailsDefault
} from "../../../modules/transfers/types";

export const transferConstants = {
    startScan: "START_SCAN"
}

export interface ICaseState {
    aCase?: ICase;
    caseData?: ICaseData;
    senderDetails: ISenderDetails;
    transferDetails: ITransferDetails;
    beneficiaryAddress: IBeneficiaryAddress;
    beneficiaryBank: IBeneficiaryBank;
    bankDetails: IBankDetails
}

export const initialState: ICaseState = {
    aCase: ICaseDefault,
    caseData: ICaseDataDefault,
    senderDetails: ISenderDetailsDefault,
    transferDetails: ITransferDetailsDefault,
    beneficiaryAddress: IBeneficiaryAddressDefault,
    beneficiaryBank: IBeneficiaryBankDefault,
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
                senderDetails: aCase.caseData.senderDetails,
                transferDetails: aCase.caseData.transferDetails,
                beneficiaryAddress: aCase.caseData.transferDetails.beneficiaryAddress,
                bankDetails: aCase.caseData.bankDetails,
                beneficiaryBank: aCase.caseData.bankDetails.beneficiaryBank
            }
        default: {
            return state;
        }
    }
}