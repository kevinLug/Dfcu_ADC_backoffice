import {ICase} from "./types";
import DeterminantFlag, {CriteriaTest, testData, testDataCallBack} from "../../utils/objectHelpers";

const validateRTGS = async (data: ICase): Promise<boolean> => {

    return new Promise((resolve) => {

        const workflowTypeExists = testData(CriteriaTest.Presence, data.workflowType, true, "transfer type not specified","Transfer type must be specified");
        testDataCallBack(workflowTypeExists,  () => {}, () => {}, true);

        const workflowType = testData(CriteriaTest.EqualTo, data.workflowType, "RTGS");
        testDataCallBack(workflowType,  () => {}, () => {}, true, )

        //  transfer details
        const branch = testData(CriteriaTest.Presence, data.caseData.transferDetails.branch, true,"bank branch name not specified", "The bank branch name must be specified");
        testDataCallBack(branch, () => {}, () => {}, true)

        const currency = testData(CriteriaTest.Presence, data.caseData.transferDetails.currency, true,"currency not specified", "The transfer currency must be specified");
        testDataCallBack(currency, () => {}, () => {}, true)

        const rate = testData(CriteriaTest.GreaterThanOrEqualTo, data.caseData.transferDetails.rate, 0, "exchange rate is less than zero", "Exchange rate can not be less than zero");
        testDataCallBack(rate, () => {}, () => {},true)

        const amount = testData(CriteriaTest.GreaterThan, data.caseData.transferDetails.amount,0, "amount not specified", "Transfer amount must be greater than zero(0)");
        testDataCallBack(amount,  () => {}, () => {}, true)

        const ugxAmount = testData(CriteriaTest.GreaterThan, data.caseData.transferDetails.ugxAmount,0,"amount in UGX not specified","Transfer amount must be specified");
        testDataCallBack(ugxAmount,  () => {}, () => {}, true)

        // noinspection DuplicatedCode
        const beneficiaryName = testData(CriteriaTest.Presence, data.caseData.transferDetails.beneficiaryName,true,"beneficiary name not specified","Beneficiary (recipient) name mus be specified");
        testDataCallBack(beneficiaryName, () => {}, () => {}, true)

        const beneficiaryCountry = testData(CriteriaTest.Presence, data.caseData.transferDetails.beneficiaryAddress.country, true,"beneficiary country not specified","Beneficiary (recipient) name must be specified")
        testDataCallBack(beneficiaryCountry, () => {}, () => {})

        const physicalAddress = testData(CriteriaTest.Presence, data.caseData.transferDetails.beneficiaryAddress.physicalAddress, true, "beneficiary physical address not specified","Beneficiary (recipient) physical address must be specified")
        testDataCallBack(physicalAddress,  () => {}, () => {}, true)

        // sender details
        const senderName = testData(CriteriaTest.Presence, data.caseData.senderDetails.name,true,"sender name not specified", "Sender name must be specified")
        testDataCallBack(senderName,  () => {}, () => {}, true)

        const senderEmail = testData(CriteriaTest.Presence, data.caseData.senderDetails.email, true, "sender email email not specified","Sender name must be specified")
        testDataCallBack(senderEmail, () => {}, () => {}, true)

        const senderAccountNumber = testData(CriteriaTest.Presence, data.caseData.senderDetails.accountNumber,true,"sender account number not specified","Sender account number must be specified")
        testDataCallBack(senderAccountNumber, () => {}, () => {}, true)

        const senderTelephone = testData(CriteriaTest.Presence, data.caseData.senderDetails.telephone, true, "sender telephone number not be specified","Sender telephone number must be specified")
        testDataCallBack(senderTelephone, () => {}, () => {}, true)

        const senderTown = testData(CriteriaTest.Presence, data.caseData.senderDetails.physicalAddress.town,true)
        testDataCallBack(senderTown,  () => {}, () => {})

        const senderDistrict = testData(CriteriaTest.Presence, data.caseData.senderDetails.physicalAddress.district, true, "sender district not specified", "Sender district must be specified")
        testDataCallBack(senderDistrict,  () => {}, () => {})

        // bank details... beneficiary bank
        const beneficiaryBankName = testData(CriteriaTest.Presence, data.caseData.bankDetails.beneficiaryBank.bankName, true, "beneficiary bank name not specified","Beneficiary (recipient) name must be specified")
        testDataCallBack(beneficiaryBankName,  () => {}, () => {})

        const beneficiaryAccountNumber = testData(CriteriaTest.Presence, data.caseData.bankDetails.beneficiaryBank.accountNumber, true,"beneficiary account number not specified","Beneficiary (recipient) account number must be specified")
        testDataCallBack(beneficiaryAccountNumber, () => {}, () => {}, true)

        const beneficiarySwiftCode = testData(CriteriaTest.Presence, data.caseData.bankDetails.beneficiaryBank.swiftCode,true)
        testDataCallBack(beneficiarySwiftCode, () => {}, () => {})

        const beneficiarySortCode = testData(CriteriaTest.Presence, data.caseData.bankDetails.beneficiaryBank.sortCode,true)
        testDataCallBack(beneficiarySortCode, () => {}, () => {})

        const beneficiaryAba = testData(CriteriaTest.Presence, data.caseData.bankDetails.beneficiaryBank.aba,true)
        testDataCallBack(beneficiaryAba, () => {}, () => {})

        const beneficiaryFedWired = testData(CriteriaTest.Presence, data.caseData.bankDetails.beneficiaryBank.fedWire)
        testDataCallBack(beneficiaryFedWired, () => {}, () => {})

        const beneficiaryIBAN = testData(CriteriaTest.Presence, data.caseData.bankDetails.beneficiaryBank.iban)
        testDataCallBack(beneficiaryIBAN,  () => {}, () => {})

        // bank details... correspondent bank
        const correspondentTransferPurpose = testData(CriteriaTest.Presence, data.caseData.bankDetails.correspondingBankDetails.transferPurpose)
        testDataCallBack(correspondentTransferPurpose, () => {}, () => {})

        resolve(DeterminantFlag.getFlag());
    });

}

export default validateRTGS
