import {ScanResultRaw} from "./types";
import {
    Case,
    IBankDetails, IBeneficiaryAddress,
    IBeneficiaryBank,
    ICase, ICaseData, ICaseDataDefault, ICaseDefault, ICharges, ICorrespondingBankDetails,
    IPhysicalAddress,
    ISenderDetails,
    ITransferDetails, ITransferDetailsDefault, IUser
} from "../transfers/types";
import {randomInt} from "../../utils/numberHelpers";
import uuid from "uuid";

export const formatRawTransferFormValuesToJson = async (scanResult: ScanResultRaw) => {

    return new Promise<ICase>((resolve, reject) => {

        const aCase = ICaseDefault
        const caseData = ICaseDataDefault
        const transferDetails = ITransferDetailsDefault
        const beneficiaryAddress = <IBeneficiaryAddress>{}
        const senderDetails = <ISenderDetails>{}
        const bankDetails = <IBankDetails>{}
        const physicalAddress = <IPhysicalAddress>{}
        const beneficiaryBank = <IBeneficiaryBank>{}
        const correspondingBankDetails = <ICorrespondingBankDetails>{}
        const charges = <ICharges>{}
        const user = <IUser>{}

        // console.log(transferDetails.branch )


        aCase.applicationDate = new Date().toDateString(); // transaction date
        aCase.workflowType = scanResult.F3 || scanResult.F4 || scanResult.F5 || scanResult.F6 || scanResult.F7 || scanResult.F8 || scanResult.F9; // transfer type
        aCase.referenceNumber =  randomInt(100000, 500000)
        aCase.externalReference = uuid()

        // caseData.date = scanResult.F2; // date specified by customer/applicant

        /*
        * caseData.transferDetails
        * */
        transferDetails.branch = scanResult.F1; // initiating branch name
        transferDetails.currency = scanResult.X1; // currency
        transferDetails.amount = Number(scanResult.X2); // amount
        transferDetails.rate = Number(scanResult.X3); // exchange rate
        transferDetails.ugxAmount = Number(scanResult.X4); // amount in UGX
        transferDetails.beneficiaryName = scanResult.X6; // full beneficiary name

        /*
        * caseData.transferDetails.beneficiaryAddress
        * */
        beneficiaryAddress.town = scanResult.X7
        beneficiaryAddress.country = scanResult.X8
        beneficiaryAddress.physicalAddress = scanResult.X9

        transferDetails.beneficiaryAddress = beneficiaryAddress; // beneficiary address

        caseData.transferDetails = transferDetails;

        /*
        *  caseData.senderDetails
        * */
        senderDetails.name = scanResult.Y3; // sender name
        senderDetails.email = scanResult.Y8; // sender email
        senderDetails.accountNumber = scanResult.Y9; // sender account number
        senderDetails.telephone = scanResult.T1; // sender telephone
        senderDetails.natureOfBusiness = scanResult.T2; // nature of business
        senderDetails.chequeNumber = scanResult.T3; // cheque number
        caseData.senderDetails = senderDetails

        /*
        * caseData.senderDetails.physicalAddress
        * */
        physicalAddress.plotNumber = scanResult.Y4; // sender plot number
        physicalAddress.street = scanResult.Y5; // sender street
        physicalAddress.town = scanResult.Y6; // sender town
        physicalAddress.district = scanResult.Y7; // sender district
        physicalAddress.signatureOfMandate = scanResult.T4; // signature of mandate
        caseData.senderDetails.physicalAddress = physicalAddress

        /*
        * caseData.bankDetails.beneficiaryBank
        * */
        beneficiaryBank.bankName = scanResult.Z2; // beneficiary bank name
        beneficiaryBank.accountNumber = scanResult.Z1; // beneficiary bank account number
        beneficiaryBank.swiftCode = scanResult.Z3; // swift code
        beneficiaryBank.sortCode = scanResult.Z4; // sort code
        beneficiaryBank.aba = scanResult.Z5; // aba
        beneficiaryBank.fedWire = scanResult.Z6; // fed wire
        beneficiaryBank.ifsc = scanResult.Z7; // IFSC
        beneficiaryBank.iban = scanResult.Z8; // IBAN
        bankDetails.beneficiaryBank = beneficiaryBank

        /*
        * caseData.bankDetails.correspondingBankDetails
        * */
        correspondingBankDetails.transferPurpose = scanResult.Z8;
        charges.applicant = Boolean(scanResult.Y1);
        charges.beneficiary = Boolean(scanResult.Y2);
        charges.amount = Number(scanResult.Z8);
        correspondingBankDetails.charges = charges
        bankDetails.correspondingBankDetails = correspondingBankDetails
        caseData.bankDetails = bankDetails

        user.id = "1f824a84-46b6-4e7f-b601-5d041118439d"
        user.name = "Daniel Comboni"
        caseData.user = user;
        // user: {
        //     id: "1f824a84-46b6-4e7f-b601-5d041118439d",
        //         name: "Daniel Comboni",
        //         phone: "256781750721",
        //         agentCode: "2345566",
        //         branchName: "02",
        //         region: "GKLA",
        // }

        aCase.caseData = caseData

        resolve(aCase)

    })


}