import ObjectHelpersFluent from "../../utils/objectHelpersFluent";
import SuccessCriteria from "../../utils/successCriteria";
import {List} from "../../utils/collections/list";
import {ICase} from "./types";
import {RequestType} from "../workflows/config";
import {ConstantLabelsAndValues} from "../../data/constants";
import Toast from "../../utils/Toast";
import validateSharedValuesAndRules from "./sharedValidations";

const validateRTGS = async (data: ICase): Promise<boolean> => {

    return new Promise((resolve) => {

        const tests = new List<ObjectHelpersFluent>()

        const dataExists = new ObjectHelpersFluent()
            .testTitle("Entire data object presence")
            .selector(data, "$")
            .isPresent()
            .addUserFailureMessage("The scan result is empty")
            .logDetailed()
        tests.add(dataExists);

        const workflowTypePresent = new ObjectHelpersFluent()
            .testTitle("workflowType presence")
            .selector(data, "$.workflowType")
            .isPresent()
            .addUserFailureMessage("Transfer type is missing")
            .logDetailed()
        tests.add(workflowTypePresent);

        const isRtgs = new ObjectHelpersFluent()
            .testTitle("is RTGS1 the type?")
            .selector(data, "$.workflowType")
            .isEqualTo(RequestType.RTGS_1)
            .addUserFailureMessage("Transfer type is missing")
            .logDetailed();
        tests.add(isRtgs);

        const isBranchPresent = new ObjectHelpersFluent()
            .testTitle("is the branch present?")
            .selector(data, "$.caseData.transferDetails.branchCode")
            .isPresent()
            .addUserFailureMessage("The bank branch is missing")
            .logDetailed()
        isBranchPresent.failureCallBack(() => Toast.error("Branch code is missing")).haltProcess(false, false)
        tests.add(isBranchPresent)

        const isCurrencyPresent = new ObjectHelpersFluent()
            .testTitle("is the currency present")
            .selector(data, "$.caseData.transferDetails.currencyCode")
            .isPresent()
            .logDetailed();
        isCurrencyPresent.failureCallBack(() => Toast.error("Currency is missing")).haltProcess(false, false)
        tests.add(isCurrencyPresent)

        const isRatePresent = new ObjectHelpersFluent()
            .testTitle("is rate present?")
            .selector(data, "$.caseData.transferDetails.exchangeRate")
            .isGreaterThanOrEqualTo(0)
            .addUserFailureMessage("rate must be greater or equal to zero")
            .isIgnorable()
            .logDetailed()
            .logDetailed()
        isRatePresent.failureCallBack(() => Toast.error("Rate is missing"))
        tests.add(isRatePresent)

        const isAmountPresent = new ObjectHelpersFluent()
            .testTitle("Is amount present ( > 0 )")
            .selector(data, "$.caseData.transferDetails.transactionAmount")
            .isGreaterThan(0)
            .addUserFailureMessage("Transaction amount must be greater or equal to zero")
            .logDetailed()
        isAmountPresent.failureCallBack(() => Toast.error("Transaction amount is missing"))
        tests.add(isAmountPresent)

        const isUgxAmountPresent = new ObjectHelpersFluent()
            .testTitle("is UGX amount present ( > 0 )")
            .selector(data, "$.caseData.transferDetails.transactionAmount")
            .isGreaterThan(0)
            .logDetailed()
        tests.add(isUgxAmountPresent)

        const isBeneficiaryNamePresent = new ObjectHelpersFluent()
            .testTitle("is recipient name present?")
            .selector(data, "$.caseData.beneficiaryDetails.fullName")
            .isPresent()
            .addUserFailureMessage("Customer's full name is non-existent")
            .logDetailed()
        isBeneficiaryNamePresent.failureCallBack(() => Toast.error("Recipient name is missing")).haltProcess(false, false)
        tests.add(isBeneficiaryNamePresent)

        // can be ignored
        const isRecipientCountryPresent = new ObjectHelpersFluent()
            .testTitle("is recipient country code present?")
            .selector(data, "$.caseData.beneficiaryDetails.address.countryCode")
            .isPresent()
            .addUserFailureMessage("Country of recipient is missing")
            // .isIgnorable()
            .logDetailed()
        isRecipientCountryPresent.failureCallBack(() => Toast.error("Country is missing"))
        tests.add(isRecipientCountryPresent)

        const isRecipientPhysicalAddressPresent = new ObjectHelpersFluent()
            .testTitle("is recipient's physical address present?")
            .selector(data, "$.caseData.beneficiaryDetails.address.physicalAddress")
            .isPresent()
            .addUserFailureMessage("Physical address of recipient is missing")
            .logDetailed()
        isRecipientPhysicalAddressPresent.failureCallBack(() => Toast.error("Recipient's physical address is missing")).haltProcess(false, false)
        tests.add(isRecipientPhysicalAddressPresent)

        const isSenderNamePresent = new ObjectHelpersFluent()
            .testTitle("is sender's name present?")
            .selector(data, "$.caseData.applicantDetails.fullName")
            .isPresent()
            .addUserFailureMessage("Sender's full name is missing")
            .logDetailed()
        isSenderNamePresent.failureCallBack(() => Toast.error("Sender's full name is missing")).haltProcess(false, false)
        tests.add(isSenderNamePresent)

        const isSenderEmailPresent = new ObjectHelpersFluent()
            .testTitle("is sender's email present?")
            .selector(data, "$.caseData.applicantDetails.emailAddress")
            .isPresent()
            .addUserFailureMessage("Sender's email address is missing")
            .logDetailed()
        isSenderEmailPresent.failureCallBack(() => Toast.error("Sender's email is missing"))
        tests.add(isSenderEmailPresent)

        validateSharedValuesAndRules(data, tests)

        resolve(SuccessCriteria.testRuns(tests, ConstantLabelsAndValues.CASE_VALIDATION_RTGS_1))
    })

}

export default validateRTGS
