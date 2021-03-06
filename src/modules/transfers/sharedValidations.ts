import ObjectHelpersFluent, { fluentValidationInstance } from "../../utils/objectHelpersFluent";
import Toast from "../../utils/Toast";
import { ICase } from "./types";
import { IList } from "../../utils/collections/list";

const validateSharedValuesAndRules = (data: ICase, tests: IList<ObjectHelpersFluent>) => {
  const isSenderAccountNumberPresent = fluentValidationInstance()
    .testTitle("is sender's account number present?")
    .selector(data, "$.caseData.applicantDetails.accountNumber")
    .isPresent()
    .addUserFailureMessage("Sender's account number is missing")
    .logDetailed();
  isSenderAccountNumberPresent.failureCallBack(() => Toast.error("Sender's account number is missing")).haltProcess(false, false);
  tests.add(isSenderAccountNumberPresent);
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

  const isSenderTelephonePresent = fluentValidationInstance()
    .testTitle("is sender's telephone present?")
    .selector(data, "$.caseData.applicantDetails.phoneNumber")
    .isPresent()
    .addUserFailureMessage("Sender's phone number is missing")
    .isIgnorable()
    .logDetailed();
  tests.add(isSenderTelephonePresent);

  const isSenderTownPresent = fluentValidationInstance().testTitle("is sender's town present?").selector(data, "$.caseData.applicantDetails.address.town").isPresent().logDetailed();
  isSenderTownPresent.failureCallBack(() => Toast.warn("Sender's town is missing"));
  tests.add(isSenderTownPresent);

  const isSenderDistrictPresent = fluentValidationInstance()
    .testTitle("is sender's district present?")
    .selector(data, "$.caseData.applicantDetails.address.district")
    .isPresent()
    .addUserFailureMessage("Sender's district is missing")
    .isIgnorable()
    .logDetailed();
  tests.add(isSenderDistrictPresent);

  const isRecipientBankNamePresent = fluentValidationInstance()
    .testTitle("is recipient bank name present?")
    .selector(data, "$.caseData.bankDetails.beneficiaryBank.bankName")
    .isPresent()
    .addUserFailureMessage("Receiving bank name is missing")
    .logDetailed();
  tests.add(isRecipientBankNamePresent);

  const isRecipientBankAccountPresent = fluentValidationInstance()
    .testTitle("is recipient bank account present?")
    .selector(data, "$.caseData.beneficiaryDetails.accountNumber")
    .isPresent()
    .addUserFailureMessage("Recipient's account number is missing")
    .logDetailed();
  tests.add(isRecipientBankAccountPresent);

  const isTransferPurposePresent = fluentValidationInstance()
    .testTitle("is transfer purpose present?")
    .selector(data, "$.caseData.transferDetails.transferPurpose")
    .isPresent()
    .addUserFailureMessage("Purpose of transfer is missing")
    // .isIgnorable()
    .logDetailed();
  tests.add(isTransferPurposePresent);
};

export default validateSharedValuesAndRules;
