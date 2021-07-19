
import ObjectHelpersFluent from "../../utils/objectHelpersFluent";
import SuccessCriteria from "../../utils/successCriteria";
import {List} from "../../utils/collections/list";
import {ICase} from "./types";
import {RequestType} from "../workflows/config";

const validateRTGS = async (data: ICase): Promise<boolean> => {

    return new Promise((resolve) => {

        const tests = new List<ObjectHelpersFluent>()

        const dataExists = new ObjectHelpersFluent()
            .testTitle("Entire data object presence")
            .selector(data, "$")
            .isPresent()
            .logValue()
            .logTestResult()
            .logTestMessage()
            .logNewLineSpace()
        tests.add(dataExists);

        const workflowTypePresent = new ObjectHelpersFluent()
            .testTitle("workflowType presence")
            .selector(data, "$.workflowType")
            .isPresent()
            .logValue()
            .logTestResult()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(workflowTypePresent);

        const isRtgs = new ObjectHelpersFluent()
            .testTitle("is RTGS1 the type?")
            .selector(data, "$.workflowType")
            .isEqualTo(RequestType.RTGS_1)
            .logValue()
            .logTestResult()
            .logTestMessage()
            .logNewLineSpace()
        tests.add(isRtgs);

        const isBranchPresent = new ObjectHelpersFluent()
            .testTitle("is the branch present?")
            .selector(data, "$.caseData.transferDetails.branchCode")
            .isPresent()
            .logValue()
            .logTestResult()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(isBranchPresent);

        const isCurrencyPresent = new ObjectHelpersFluent()
            .testTitle("is the currency present")
            .selector(data, "$.caseData.transferDetails.currencyCode")
            .isPresent()
            .logValue()
            .logTestResult()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(isCurrencyPresent);

        const isRatePresent = new ObjectHelpersFluent()
            .testTitle("is rate present")
            .selector(data, "$.caseData.transferDetails.exchangeRate")
            .isGreaterThanOrEqualTo(0)
            .logTestResult()
            .logValue()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(isRatePresent)

        const isAmountPresent = new ObjectHelpersFluent()
            .testTitle("Is amount present ( > 0 )")
            .selector(data, "$.caseData.transferDetails.transactionAmount")
            .isGreaterThan(0)
            .logTestResult()
            .logValue()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(isAmountPresent);

        const isUgxAmountPresent = new ObjectHelpersFluent()
            .testTitle("is UGX amount present ( > 0 )")
            .selector(data, "$.caseData.transferDetails.transactionAmount")
            .isGreaterThan(0)
            .logTestResult()
            .logTestMessage()
            .logValue()
            .logNewLineSpace();
        tests.add(isUgxAmountPresent);

        const isBeneficiaryNamePresent = new ObjectHelpersFluent()
            .testTitle("is recipient name present?")
            .selector(data, "$.caseData.beneficiaryDetails.fullName")
            .isPresent()
            .logTestResult()
            .logValue()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(isBeneficiaryNamePresent);

        const isRecipientCountryPresent = new ObjectHelpersFluent()
            .testTitle("is recipient country code present?")
            .selector(data, "$.caseData.beneficiaryDetails.address.countryCode")
            .isPresent()
            .logTestResult().logValue().logTestMessage().logNewLineSpace();
        tests.add(isRecipientCountryPresent);

        const isRecipientPhysicalAddressPresent = new ObjectHelpersFluent()
            .testTitle("is recipient's physical address present?")
            .selector(data, "$.caseData.beneficiaryDetails.address.physicalAddress")
            .isPresent()
            .logTestResult()
            .logValue()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(isRecipientPhysicalAddressPresent);

        const isSenderNamePresent = new ObjectHelpersFluent()
            .testTitle("is sender's name present?")
            .selector(data, "$.caseData.applicantDetails.fullName")
            .isPresent()
            .logTestResult()
            .logValue()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(isSenderNamePresent);

        const isSenderEmailPresent = new ObjectHelpersFluent()
            .testTitle("is sender's email present?")
            .selector(data, "$.caseData.applicantDetails.emailAddress")
            .isPresent()
            .logTestResult()
            .logValue()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(isSenderEmailPresent);

        const isSenderAccountNumberPresent = new ObjectHelpersFluent()
            .testTitle("is sender's account number present?")
            .selector(data, "$.caseData.applicantDetails.accountNumber")
            .isPresent()
            .logTestResult()
            .logValue()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(isSenderAccountNumberPresent);

        const isSenderTelephonePresent = new ObjectHelpersFluent()
            .testTitle("is sender's telephone present?")
            .selector(data, "$.caseData.applicantDetails.phoneNumber")
            .isPresent()
            .logTestResult()
            .logValue()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(isSenderTelephonePresent);

        const isSenderTownPresent = new ObjectHelpersFluent()
            .testTitle("is sender's town present?")
            .selector(data, "$.caseData.applicantDetails.address.town")
            .isPresent()
            .logTestResult()
            .logValue()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(isSenderTownPresent)

        const isSenderDistrictPresent = new ObjectHelpersFluent()
            .testTitle("is sender's district present?")
            .selector(data, "$.caseData.applicantDetails.address.district")
            .isPresent()
            .logTestResult()
            .logValue()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(isSenderDistrictPresent);

        const isRecipientBankNamePresent = new ObjectHelpersFluent()
            .testTitle("is recipient bank name present?")
            .selector(data, "$.caseData.bankDetails.beneficiaryBank.bankName")
            .isPresent()
            .logTestResult()
            .logValue()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(isRecipientBankNamePresent);

        const isRecipientBankAccountPresent = new ObjectHelpersFluent()
            .testTitle("is recipient bank account present?")
            .selector(data, "$.caseData.beneficiaryDetails.accountNumber")
            .isPresent()
            .logTestResult()
            .logValue()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(isRecipientBankAccountPresent);

        const isRecipientBankSwiftCodePresent = new ObjectHelpersFluent()
            .testTitle("is recipient bank swift code present?")
            .selector(data, "$.caseData.bankDetails.beneficiaryBank.swiftCode")
            .isPresent()
            .logTestResult()
            .logValue()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(isRecipientBankSwiftCodePresent);

        const isRecipientBankSortCodePresent = new ObjectHelpersFluent()
            .testTitle("is recipient bank sort code present?")
            .selector(data, "$.caseData.bankDetails.beneficiaryBank.sortCode")
            .isPresent()
            .isIgnorable()
            .logTestResult()
            .logValue()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(isRecipientBankSortCodePresent);

        const isRecipientBankAbaPresent = new ObjectHelpersFluent()
            .testTitle("is recipient bank ABA present?")
            .selector(data, "$.caseData.bankDetails.beneficiaryBank.aba")
            .isPresent()
            .isIgnorable()
            .logTestResult()
            .logValue()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(isRecipientBankAbaPresent);

        const isRecipientBankFedWirePresent = new ObjectHelpersFluent()
            .testTitle("is recipient bank fed wire present?")
            .selector(data, "$.caseData.bankDetails.beneficiaryBank.fedWire")
            .isPresent()
            .isIgnorable()
            .logTestResult()
            .logValue()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(isRecipientBankFedWirePresent);

        const isRecipientBankIbanPresent = new ObjectHelpersFluent()
            .testTitle("is recipient bank iban present?")
            .selector(data, "$.caseData.bankDetails.beneficiaryBank.iban")
            .isPresent()
            .isIgnorable()
            .logTestResult()
            .logValue()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(isRecipientBankIbanPresent);

        const isTransferPurposePresent = new ObjectHelpersFluent()
            .testTitle("is transfer purpose present?")
            .selector(data, "$.caseData.transferDetails.transferPurpose")
            .isPresent()
            .logTestResult()
            .logValue()
            .logTestMessage()
            .logNewLineSpace();
        tests.add(isTransferPurposePresent);

        resolve(SuccessCriteria.testRuns(tests));
    });

}

export default validateRTGS
