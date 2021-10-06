import {ICase} from "./types";
import ObjectHelpersFluent, {fluentValidationInstance} from "../../utils/objectHelpersFluent";
import SuccessCriteria from "../../utils/successCriteria";
import {List} from "../../utils/collections/list";

import {ConstantLabelsAndValues} from "../../data/constants";
import Toast from "../../utils/Toast";
import validateSharedValuesAndRules from "./sharedValidations";

const validateSwift = async (data: ICase): Promise<boolean> => {

    return new Promise((resolve) => {

        const tests = new List<ObjectHelpersFluent>()

        const dataExists = fluentValidationInstance()
            .testTitle("Entire data object presence")
            .selector(data, "$")
            .isPresent()
            .logDetailed();
        tests.add(dataExists);

        const workflowTypePresent = fluentValidationInstance()
            .testTitle("workflowType presence")
            .selector(data, "$.workflowType")
            .isPresent()
            .addUserFailureMessage("Transfer type is missing")
            .logDetailed()
        tests.add(workflowTypePresent);

        const isBranchPresent = fluentValidationInstance()
            .testTitle("is the branch present?")
            .selector(data, "$.caseData.transferDetails.branchCode")
            .isPresent()
            .addUserFailureMessage("The bank branch is missing")
            .logDetailed();
        tests.add(isBranchPresent)

        const isCurrencyPresent = fluentValidationInstance()
            .testTitle("is the currency present")
            .selector(data, "$.caseData.transferDetails.currencyCode")
            .isPresent()
            .addUserFailureMessage("The currency code is missing")
            .logDetailed();
        tests.add(isCurrencyPresent)

        const isRatePresent = fluentValidationInstance()
            .testTitle("is rate present?")
            .selector(data, "$.caseData.transferDetails.exchangeRate")
            .isGreaterThanOrEqualTo(0)
            .addUserFailureMessage("rate must be greater or equal to zero")
            .isIgnorable()
            .logDetailed();
        tests.add(isRatePresent)

        const isAmountPresent = fluentValidationInstance()
            .testTitle("Is amount present ( > 0 )")
            .selector(data, "$.caseData.transferDetails.transactionAmount")
            .isGreaterThan(0)
            .addUserFailureMessage("Transaction amount must be greater or equal to zero")
            .logDetailed();
        tests.add(isAmountPresent)

        const isUgxAmountPresent = fluentValidationInstance()
            .testTitle("is UGX amount present ( > 0 )")
            .selector(data, "$.caseData.transferDetails.transactionAmount")
            .isGreaterThan(0)
            .logDetailed();
        tests.add(isUgxAmountPresent)

        const isBeneficiaryNamePresent = fluentValidationInstance()
            .testTitle("is recipient name present?")
            .selector(data, "$.caseData.beneficiaryDetails.fullName")
            .isPresent()
            .addUserFailureMessage("Customer's full name is non-existent")
            .logDetailed();
        tests.add(isBeneficiaryNamePresent);

        // can be ignored
        const isRecipientCountryPresent = fluentValidationInstance()
            .testTitle("is recipient country code present?")
            .selector(data, "$.caseData.beneficiaryDetails.address.countryCode")
            .isPresent()
            .addUserFailureMessage("Country of recipient is missing")
            // .isIgnorable()
            .logDetailed();
        tests.add(isRecipientCountryPresent)

        const isRecipientPhysicalAddressPresent = fluentValidationInstance()
            .testTitle("is recipient's physical address present?")
            .selector(data, "$.caseData.beneficiaryDetails.address.physicalAddress")
            .isPresent()
            .addUserFailureMessage("Physical address of recipient is missing")
            .logDetailed();
        tests.add(isRecipientPhysicalAddressPresent)

        const isSenderNamePresent = fluentValidationInstance()
            .testTitle("is sender's name present?")
            .selector(data, "$.caseData.applicantDetails.fullName")
            .isPresent()
            .addUserFailureMessage("Sender's full name is missing")
            .logDetailed();
        tests.add(isSenderNamePresent)

        const isSenderEmailPresent = new ObjectHelpersFluent()
            .testTitle("is sender's email present?")
            .selector(data, "$.caseData.applicantDetails.emailAddress")
            .isPresent()
            .addUserFailureMessage("Sender's email address is missing")
            .logDetailed()
        tests.add(isSenderEmailPresent)

        const isRecipientBankSwiftCodePresent = new ObjectHelpersFluent()
            .testTitle("is recipient bank swift code present?")
            .selector(data, "$.caseData.bankDetails.beneficiaryBank.swiftCode")
            .isPresent()
            .addUserFailureMessage("SWIFT code is missing")
            // .isIgnorable()
            .logDetailed()
        tests.add(isRecipientBankSwiftCodePresent)

        const isRecipientBankSortCodePresent = new ObjectHelpersFluent()
            .testTitle("is recipient bank sort code present?")
            .selector(data, "$.caseData.bankDetails.beneficiaryBank.sortCode")
            .isPresent()
            .addUserFailureMessage("Sort code is missing")
            .isIgnorable()
            .logDetailed()
        isRecipientBankSortCodePresent.failureCallBack(() => Toast.error("Recipient's bank SORT code is missing"))
        tests.add(isRecipientBankSortCodePresent)

        const isRecipientBankAbaPresent = new ObjectHelpersFluent()
            .testTitle("is recipient bank ABA present?")
            .selector(data, "$.caseData.bankDetails.beneficiaryBank.aba")
            .isPresent()
            .addUserFailureMessage("ABA is missing")
            .isIgnorable()
            .logDetailed()
        isRecipientBankAbaPresent.failureCallBack(() => Toast.error("Recipient bank ABA is missing"))
        tests.add(isRecipientBankAbaPresent)

        const isRecipientBankFedWirePresent = new ObjectHelpersFluent()
            .testTitle("is recipient bank fed wire present?")
            .selector(data, "$.caseData.bankDetails.beneficiaryBank.fedWire")
            .isPresent()
            .addUserFailureMessage("Fedwire is missing")
            .isIgnorable()
            .logDetailed()
        isRecipientBankFedWirePresent.failureCallBack(() => Toast.error("Fedwire is missing"))
        tests.add(isRecipientBankFedWirePresent)

        const isRecipientBankIbanPresent = new ObjectHelpersFluent()
            .testTitle("is recipient bank iban present?")
            .selector(data, "$.caseData.bankDetails.beneficiaryBank.iban")
            .isPresent()
            .addUserFailureMessage("IBAN is missing")
            .isIgnorable()
            .logDetailed()
        isRecipientBankIbanPresent.failureCallBack(() => Toast.error("IBAN is missing"))
        tests.add(isRecipientBankIbanPresent)

        validateSharedValuesAndRules(data, tests)

        resolve(SuccessCriteria.testRuns(tests, ConstantLabelsAndValues.CASE_VALIDATION_SWIFT))
    })

}

export default validateSwift
