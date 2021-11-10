import { List } from "../../utils/collections/list";
import ObjectHelpersFluent, { fluentValidationInstance } from "../../utils/objectHelpersFluent";
import Toast from "../../utils/Toast";
import { RequestType } from "../workflows/config";
import { ICase } from "./types";

class GeneralValidations {
  static checkCasePresence(data: ICase, validations: List<ObjectHelpersFluent>) {
    const dataExists = fluentValidationInstance().testTitle("Entire data object presence").selector(data, "$").isPresent().addUserFailureMessage("No data found").logDetailed();
    validations.add(dataExists);
  }

  static checkTransferModePresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const workflowTypePresent = fluentValidationInstance()
      .testTitle("workflowType presence")
      .selector(data, "$.workflowType")
      .isPresent()
      .addUserFailureMessage("Transfer mode is missing")
      .logDetailed();
    tests.add(workflowTypePresent);
  }

  static checkTransferModeEquality(data: ICase, tests: List<ObjectHelpersFluent>, workflowType: RequestType) {
    const isINTERNAL = fluentValidationInstance()
            .testTitle("is the type of transfer (workflow) equal to ?")
            .selector(data, "$.workflowType")
            .isEqualTo(workflowType)
            .addUserFailureMessage("Wrong tranfer mode")
            .logDetailed()
        tests.add(isINTERNAL)
  }

  static checkBranchPresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isBranchPresent = fluentValidationInstance()
      .testTitle("is the branch present?")
      .selector(data, "$.caseData.transferDetails.branchCode")
      .isPresent()
      .addUserFailureMessage("The bank branch is missing")
      .logDetailed();
    tests.add(isBranchPresent);
  }

  static checkCurrencyPresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isCurrencyPresent = fluentValidationInstance()
      .testTitle("is the currency present")
      .selector(data, "$.caseData.transferDetails.currencyCode")
      .isPresent()
      .addUserFailureMessage("The currency code is missing")
      .logDetailed();
    tests.add(isCurrencyPresent);
  }

  static checkRateIsInvolved(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isRateInvolve = fluentValidationInstance()
      .testTitle("is rate required present?")
      .selector(data, "$.caseData.transferDetails.rateInvolve")
      .isEqualTo("1")
      // .addUserFailureMessage(" is rate a requirement?")
      .isIgnorable()
      .logDetailed();
    tests.add(isRateInvolve);

    const flagRateRequirement = fluentValidationInstance()
      .testTitle("side-work for checking if rate is a requirement")
      .selector(isRateInvolve.getSummary().testResult, "$")
      .isPresent()
      .getSummary().testResult;

    if (flagRateRequirement) {
      const isRatePresent = fluentValidationInstance()
        .testTitle("is rate present?")
        .selector(data, "$.caseData.transferDetails.rate")
        .isGreaterThanOrEqualTo(1)
        .addUserFailureMessage("Rate must be greater than or equal to one (1)")
        // .isIgnorable()
        .logDetailed();
      isRatePresent.failureCallBack(() => Toast.error("Rate is missing"));
      tests.add(isRatePresent);
    }
  }

  static checkAmountPresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isAmountPresent = fluentValidationInstance()
      .testTitle("Is amount present ( > 0 )")
      .selector(data, "$.caseData.transferDetails.transactionAmount")
      .isGreaterThan(0)
      .addUserFailureMessage("Transaction amount must be greater than zero (0)")
      .logDetailed();
    tests.add(isAmountPresent);
  }

  static checkBeneficiaryNamePresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isBeneficiaryNamePresent = fluentValidationInstance()
      .testTitle("is recipient name present?")
      .selector(data, "$.caseData.beneficiaryDetails.fullName")
      .isPresent()
      .addUserFailureMessage("Customer's full name is non-existent")
      .logDetailed();
    tests.add(isBeneficiaryNamePresent);
  }

  static checkBeneficiaryCountryPresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isRecipientCountryPresent = fluentValidationInstance()
      .testTitle("is recipient country code present?")
      .selector(data, "$.caseData.beneficiaryDetails.address.countryCode")
      .isPresent()
      .addUserFailureMessage("Country of recipient is missing")
      // .isIgnorable()
      .logDetailed();
    tests.add(isRecipientCountryPresent);
  }

  static checkBeneficiaryPhysicalAddressPresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isRecipientPhysicalAddressPresent = fluentValidationInstance()
      .testTitle("is recipient's physical address present?")
      .selector(data, "$.caseData.beneficiaryDetails.address.physicalAddress")
      .isPresent()
      .addUserFailureMessage("Physical address of recipient is missing")
      .logDetailed();
    tests.add(isRecipientPhysicalAddressPresent);
  }

  static checkBeneficiaryTownPresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isRecipientTownPresent = fluentValidationInstance()
      .testTitle("is recipient bank account present?")
      .selector(data, "$.caseData.beneficiaryDetails.address.town")
      .isPresent()
      .addUserFailureMessage("Recipient's town is missing")
      .logDetailed();
    tests.add(isRecipientTownPresent);
  }

  static checkSenderNamePresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isSenderNamePresent = fluentValidationInstance()
      .testTitle("is sender's name present?")
      .selector(data, "$.caseData.applicantDetails.fullName")
      .isPresent()
      .addUserFailureMessage("Sender's name is missing")
      .logDetailed();
    tests.add(isSenderNamePresent);
  }

  static checkSenderEmailPresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isSenderEmailPresent = fluentValidationInstance()
      .testTitle("is sender's email present?")
      .selector(data, "$.caseData.applicantDetails.emailAddress")
      .isPresent()
      .addUserFailureMessage("Sender's email address is missing")
      .isIgnorable()
      .logDetailed();
    tests.add(isSenderEmailPresent);
  }

  static checkBeneficiaryBankSwiftCodePresence(data: ICase, tests: List<ObjectHelpersFluent>, ignorable:boolean = true) {
    const isRecipientBankSwiftCodePresent = fluentValidationInstance()
      .testTitle("is recipient bank swift code present?")
      .selector(data, "$.caseData.bankDetails.beneficiaryBank.swiftCode")
      .isPresent()
      .addUserFailureMessage("SWIFT code is missing")
      .isIgnorable(ignorable)
      .logDetailed();
    tests.add(isRecipientBankSwiftCodePresent);
  }

  static checkBeneficiaryBankSortCodePresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isRecipientBankSortCodePresent = fluentValidationInstance()
      .testTitle("is recipient bank sort code present?")
      .selector(data, "$.caseData.bankDetails.beneficiaryBank.sortCode")
      .isPresent()
      .addUserFailureMessage("Sort code is missing")
      .isIgnorable()
      .logDetailed();
    isRecipientBankSortCodePresent.failureCallBack(() => Toast.error("Recipient's bank SORT code is missing"));
    tests.add(isRecipientBankSortCodePresent);
  }

  static checkBeneficiaryBankAbaPresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isRecipientBankAbaPresent = fluentValidationInstance()
      .testTitle("is recipient bank ABA present?")
      .selector(data, "$.caseData.bankDetails.beneficiaryBank.aba")
      .isPresent()
      .addUserFailureMessage("ABA is missing")
      .isIgnorable()
      .logDetailed();
    isRecipientBankAbaPresent.failureCallBack(() => Toast.error("Recipient bank ABA is missing"));
    tests.add(isRecipientBankAbaPresent);
  }

  static checkBeneficiaryBankFedwirePresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isRecipientBankFedWirePresent = fluentValidationInstance()
      .testTitle("is recipient bank fed wire present?")
      .selector(data, "$.caseData.bankDetails.beneficiaryBank.fedWire")
      .isPresent()
      .addUserFailureMessage("Fedwire is missing")
      .isIgnorable()
      .logDetailed();
    isRecipientBankFedWirePresent.failureCallBack(() => Toast.error("Fedwire is missing"));
    tests.add(isRecipientBankFedWirePresent);
  }
  static checkBeneficiaryBankIbanPresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isRecipientBankIbanPresent = fluentValidationInstance()
      .testTitle("is recipient bank iban present?")
      .selector(data, "$.caseData.bankDetails.beneficiaryBank.iban")
      .isPresent()
      .addUserFailureMessage("IBAN is missing")
      .isIgnorable()
      .logDetailed();
    isRecipientBankIbanPresent.failureCallBack(() => Toast.error("IBAN is missing"));
    tests.add(isRecipientBankIbanPresent);
  }

  static checkSenderAccountNumberPresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isSenderAccountNumberPresent = fluentValidationInstance()
      .testTitle("is sender's account number present?")
      .selector(data, "$.caseData.applicantDetails.accountNumber")
      .isPresent()
      .addUserFailureMessage("Sender's account number is missing")
      .logDetailed();
    isSenderAccountNumberPresent.failureCallBack(() => Toast.error("Sender's account number is missing")).haltProcess(false, false);
    tests.add(isSenderAccountNumberPresent);
  }

  static checkSenderAccountNumberLength(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isSenderAccountNumberPresent = fluentValidationInstance()
      .testTitle("is sender's account number present?")
      .selector(data, "$.caseData.applicantDetails.accountNumber")
      .isPresent()
      .addUserFailureMessage("Sender's account number is missing")
      .logDetailed();
    isSenderAccountNumberPresent.failureCallBack(() => Toast.error("Sender's account number is missing")).haltProcess(false, false);

    const accountNumberOfSenderLength = isSenderAccountNumberPresent.getSummary().value.length;

    const isSenderAccountNumberEqualTo_14 = fluentValidationInstance()
      .testTitle("is sender's account number length equal to 14?")
      .selector(accountNumberOfSenderLength, "$")
      .isEqualTo(14)
      .logDetailed()
      .addUserFailureMessage("Sender's account number length is not equal to 14");
    isSenderAccountNumberEqualTo_14
      .failureCallBack(() => {
        if (isSenderAccountNumberEqualTo_14.getSummary().value > isSenderAccountNumberEqualTo_14.getSummary().expected)
          isSenderAccountNumberEqualTo_14.addUserFailureMessage("Sender's account number length is above required length of 14");
        if (isSenderAccountNumberEqualTo_14.getSummary().value < isSenderAccountNumberEqualTo_14.getSummary().expected)
          isSenderAccountNumberEqualTo_14.addUserFailureMessage("Sender's account number length is below required length of 14");

        Toast.error("Sender's account number is not equal to 14");
      })
      .haltProcess(false, false);
    tests.add(isSenderAccountNumberEqualTo_14);
  }

  static checkSenderTelephonePresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isSenderTelephonePresent = fluentValidationInstance()
      .testTitle("is sender's telephone present?")
      .selector(data, "$.caseData.applicantDetails.phoneNumber")
      .isPresent()
      .addUserFailureMessage("Sender's phone number is missing")
      .isIgnorable()
      .logDetailed();
    tests.add(isSenderTelephonePresent);
  }

  static checkSenderTownPresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isSenderTownPresent = fluentValidationInstance()
      .testTitle("is sender's town present?")
      .selector(data, "$.caseData.applicantDetails.address.town")
      .isPresent()
      .logDetailed();
    isSenderTownPresent.failureCallBack(() => Toast.warn("Sender's town is missing"));
    tests.add(isSenderTownPresent);
  }

  static checkSenderDistrictPresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isSenderDistrictPresent = fluentValidationInstance()
      .testTitle("is sender's district present?")
      .selector(data, "$.caseData.applicantDetails.address.district")
      .isPresent()
      .addUserFailureMessage("Sender's district is missing")
      .isIgnorable()
      .logDetailed();
    tests.add(isSenderDistrictPresent);
  }

  static checkBeneficiaryBankNamePresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isRecipientBankNamePresent = fluentValidationInstance()
      .testTitle("is recipient bank name present?")
      .selector(data, "$.caseData.bankDetails.beneficiaryBank.bankName")
      .isPresent()
      .addUserFailureMessage("Receiving bank name is missing")
      .logDetailed();
    tests.add(isRecipientBankNamePresent);
  }

  static checkBeneficiaryBankAccountPresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isRecipientBankAccountPresent = fluentValidationInstance()
      .testTitle("is recipient bank account present?")
      .selector(data, "$.caseData.beneficiaryDetails.accountNumber")
      .isPresent()
      .addUserFailureMessage("Recipient's account number is missing")
      .logDetailed();
    tests.add(isRecipientBankAccountPresent);
  }

  static checkTansferPurposePresence(data: ICase, tests: List<ObjectHelpersFluent>) {
    const isTransferPurposePresent = fluentValidationInstance()
      .testTitle("is transfer purpose present?")
      .selector(data, "$.caseData.transferDetails.transferPurpose")
      .isPresent()
      .addUserFailureMessage("Purpose of transfer is missing")
      // .isIgnorable()
      .logDetailed();
    tests.add(isTransferPurposePresent);
  }

  static checkChargeModePresence(data: ICase, tests: List<ObjectHelpersFluent>, ignorable: boolean = true) {
    const isTransferPurposePresent = fluentValidationInstance()
      .testTitle("is charge mode present?")
      .selector(data, "$.caseData.charges.chargeMode")
      .isPresent()
      .addUserFailureMessage("Charge mode is required")
      .isIgnorable(ignorable)
      .logDetailed();
    tests.add(isTransferPurposePresent);
  }

}

export default GeneralValidations;
