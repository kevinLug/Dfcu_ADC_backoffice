import {ScanResultRaw} from "./types";
import {
    Case,
    IBankDetails, IBeneficiaryAddress,
    IBeneficiaryBank, IBeneficiaryDetailsDefault,
    ICase, ICaseData, ICaseDataDefault, ICaseDefault, ICharges, ICorrespondingBankDetails,
    IPhysicalAddress,
    ISenderDetails,
    ITransferDetails, ITransferDetailsDefault, IUser
} from "../transfers/types";
import {randomInt} from "../../utils/numberHelpers";
import uuid from "uuid";
import {mappingRules as rules} from './mappings/rules'

import {isNullOrEmpty} from "../../utils/objectHelpers";

export const formatRawTransferFormValuesToJson = async (scanResult: ScanResultRaw, docBase64: string) => {

    return new Promise<ICase>((resolve, reject) => {

        const aCase = ICaseDefault
        const caseData = ICaseDataDefault
        // const transferDetails = ITransferDetailsDefault
        // const beneficiaryAddress = <IBeneficiaryAddress>{}
        // const senderDetails = <ISenderDetails>{}
        // const bankDetails = <IBankDetails>{}
        // const physicalAddress = <IPhysicalAddress>{}
        // const beneficiaryBank = <IBeneficiaryBank>{}
        // const correspondingBankDetails = <ICorrespondingBankDetails>{}
        // const charges = <ICharges>{}
        // const user = <IUser>{}
        // const beneficiaryDetails = IBeneficiaryDetailsDefault

        // console.log(transferDetails.branch )

        aCase.applicationDate = new Date(); // transaction date
        aCase.workflowType = rules.case.workflowType;


        aCase.referenceNumber = randomInt(100000, 500000)
        aCase.externalReference = uuid()

        caseData.transferDetails.branchCode = rules.case.caseData.transferDetails.branchCode;
        caseData.transferDetails.remittanceType = rules.case.caseData.transferDetails.remittanceType;
        caseData.transferDetails.currencyCode = rules.case.caseData.transferDetails.currencyCode;
        caseData.transferDetails.transactionAmount = Number(rules.case.caseData.transferDetails.transactionAmount);
        caseData.transferDetails.remittanceAmount = rules.case.caseData.transferDetails.remittanceAmount;
        caseData.transferDetails.exchangeRate = Number(rules.case.caseData.transferDetails.exchangeRate);
        caseData.transferDetails.amountInWords = rules.case.caseData.transferDetails.amountInWords;
        caseData.transferDetails.transferPurpose = rules.case.caseData.transferDetails.transferPurpose;
        caseData.bankDetails.beneficiaryBank.bankName = rules.case.caseData.bankDetails.beneficiaryBank.bankName;
        caseData.bankDetails.beneficiaryBank.swiftCode = rules.case.caseData.bankDetails.beneficiaryBank.swiftCode;
        caseData.bankDetails.beneficiaryBank.sortCode = rules.case.caseData.bankDetails.beneficiaryBank.sortCode;
        caseData.bankDetails.beneficiaryBank.aba = rules.case.caseData.bankDetails.beneficiaryBank.aba;
        caseData.bankDetails.beneficiaryBank.fedwire = rules.case.caseData.bankDetails.beneficiaryBank.fedwire;
        caseData.bankDetails.beneficiaryBank.ifsc = rules.case.caseData.bankDetails.beneficiaryBank.ifsc;
        caseData.bankDetails.beneficiaryBank.iban = rules.case.caseData.bankDetails.beneficiaryBank.iban;
        caseData.bankDetails.applicantBank.branchCode = rules.case.caseData.bankDetails.applicantBank.branchCode;
        caseData.charges.chargeMode = rules.case.caseData.charges.chargeMode;
        caseData.beneficiaryDetails.fullName = rules.case.caseData.beneficiaryDetails.fullName;
        caseData.beneficiaryDetails.accountNumber = rules.case.caseData.beneficiaryDetails.accountNumber;
        caseData.beneficiaryDetails.address.town = rules.case.caseData.beneficiaryDetails.address.town;
        caseData.beneficiaryDetails.address.countryCode = rules.case.caseData.beneficiaryDetails.address.countryCode;
        caseData.beneficiaryDetails.address.physicalAddress = rules.case.caseData.beneficiaryDetails.address.physicalAddress;
        caseData.applicantDetails.fullName = rules.case.caseData.applicantDetails.fullName;
        caseData.applicantDetails.accountNumber = rules.case.caseData.applicantDetails.accountNumber;
        caseData.applicantDetails.chequeNumber = rules.case.caseData.applicantDetails.chequeNumber;
        caseData.applicantDetails.emailAddress = rules.case.caseData.applicantDetails.emailAddress;
        caseData.applicantDetails.phoneNumber = rules.case.caseData.applicantDetails.phoneNumber;
        caseData.applicantDetails.natureOfBusiness = rules.case.caseData.applicantDetails.natureOfBusiness;
        caseData.applicantDetails.address.plotNumber = rules.case.caseData.applicantDetails.address.plotNumber;
        caseData.applicantDetails.address.street = rules.case.caseData.applicantDetails.address.street;
        caseData.applicantDetails.address.town = rules.case.caseData.applicantDetails.address.town;
        caseData.applicantDetails.address.district = rules.case.caseData.applicantDetails.address.district;
        caseData.user.id = rules.case.caseData.user.id;
        caseData.user.name = rules.case.caseData.user.name;
        caseData.user.phone = rules.case.caseData.user.phone;
        caseData.user.agentCode = rules.case.caseData.user.agentCode;
        caseData.user.branchName = rules.case.caseData.user.branchName;
        caseData.user.region = rules.case.caseData.user.region

        if (!isNullOrEmpty(docBase64)) {
            caseData.doc = new Buffer(docBase64.split(",")[1], "base64")
        }

        aCase.caseData = caseData

        resolve(aCase)

    })


}