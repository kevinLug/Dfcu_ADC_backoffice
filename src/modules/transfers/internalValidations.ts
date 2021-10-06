import ObjectHelpersFluent, {fluentValidationInstance} from "../../utils/objectHelpersFluent"
import SuccessCriteria from "../../utils/successCriteria"
import {List} from "../../utils/collections/list"
import {ICase} from "./types"
import {RequestType} from "../workflows/config"
import Toast from "../../utils/Toast"
import {ConstantLabelsAndValues} from "../../data/constants"
import validateSharedValuesAndRules from "./sharedValidations";

const validateInternal = async (data: ICase): Promise<boolean> => {

    return new Promise((resolve) => {

        const tests = new List<ObjectHelpersFluent>()

        const dataExists = new ObjectHelpersFluent()
            .testTitle("Entire data object presence")
            .selector(data, "$")
            .isPresent()
            .logDetailed()
        dataExists.failureCallBack(() => Toast.error("scan result not found")).haltProcess(false, false)
        tests.add(dataExists)

        const workflowTypePresent = new ObjectHelpersFluent()
            .testTitle("workflowType presence")
            .selector(data, "$.workflowType")
            .isPresent()
            .logDetailed()
        workflowTypePresent.failureCallBack(() => Toast.error("transfer type is missing")).haltProcess(false, false)
        tests.add(workflowTypePresent)

        const isINTERNAL = new ObjectHelpersFluent()
            .testTitle("is INTERNAL the type of transfer?")
            .selector(data, "$.workflowType")
            .isEqualTo(RequestType.INTERNAL)
            .logDetailed()
        tests.add(isINTERNAL)

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
            .logDetailed()
        isCurrencyPresent.failureCallBack(() => Toast.error("Currency is missing")).haltProcess(false, false)
        tests.add(isCurrencyPresent)

        const isRateInvolve = fluentValidationInstance()
            .testTitle("is rate required present?")
            .selector(data, "$.caseData.transferDetails.rateInvolve")
            .isEqualTo("1")
            // .addUserFailureMessage(" is rate a requirement?")
            .isIgnorable()
            .logDetailed()
            .logDetailed()
        tests.add(isRateInvolve);

        const flagRateRequirement = fluentValidationInstance()
            .testTitle("side-work for checking if rate is a requirement")
            .selector(isRateInvolve.getSummary().testResult, "$")
            .isEqualTo(true)
            .getSummary().testResult

        if (flagRateRequirement){

            const isRatePresent = fluentValidationInstance()
                .testTitle("is rate present?")
                .selector(data, "$.caseData.transferDetails.rate")
                .isGreaterThanOrEqualTo(0)
                .addUserFailureMessage("rate must be greater zero (0)")
                .isIgnorable()
                .logDetailed()
                .logDetailed()
            isRatePresent.failureCallBack(() => Toast.error("Rate is missing"))
            tests.add(isRatePresent)

        }

        const isAmountPresent = fluentValidationInstance()
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


        resolve(SuccessCriteria.testRuns(tests, ConstantLabelsAndValues.CASE_VALIDATION_INTERNAL))
    })

}

export default validateInternal
