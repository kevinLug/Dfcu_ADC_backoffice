import ObjectHelpersFluent, { fluentValidationInstance } from "../../utils/objectHelpersFluent";
import SuccessCriteria from "../../utils/successCriteria";
import { List } from "../../utils/collections/list";
import { ICase } from "./types";
import { RequestType } from "../workflows/config";
import Toast from "../../utils/Toast";
import { ConstantLabelsAndValues } from "../../data/constants";
import validateSharedValuesAndRules from "./sharedValidations";
import GeneralValidations from "./generalValidations";

const validateInternal = async (data: ICase): Promise<boolean> => {
  return new Promise((resolve) => {
    const tests = new List<ObjectHelpersFluent>();

    GeneralValidations.checkCasePresence(data, tests);

    GeneralValidations.checkTransferModePresence(data, tests);

    GeneralValidations.checkTransferModeEquality(data, tests, RequestType.INTERNAL);

    GeneralValidations.checkBranchPresence(data, tests);

    GeneralValidations.checkCurrencyPresence(data, tests);

    // GeneralValidations.checkRateIsInvolved(data, tests);

    GeneralValidations.checkAmountPresence(data, tests);

    GeneralValidations.checkBeneficiaryNamePresence(data, tests);

    GeneralValidations.checkBeneficiaryCountryPresence(data, tests);

    GeneralValidations.checkBeneficiaryPhysicalAddressPresence(data, tests);

    GeneralValidations.checkBeneficiaryTownPresence(data, tests);

    GeneralValidations.checkSenderNamePresence(data, tests);

    GeneralValidations.checkSenderEmailPresence(data, tests);

    GeneralValidations.checkSenderAccountNumberPresence(data, tests);

    GeneralValidations.checkSenderAccountNumberLength(data, tests);

    GeneralValidations.checkTansferPurposePresence(data, tests);

    GeneralValidations.checkSenderTownPresence(data, tests);

    GeneralValidations.checkSenderDistrictPresence(data, tests);

    GeneralValidations.checkBeneficiaryBankNamePresence(data, tests);

    GeneralValidations.checkBeneficiaryBankAccountPresence(data, tests);

    resolve(SuccessCriteria.testRuns(tests, ConstantLabelsAndValues.CASE_VALIDATION_INTERNAL));
  });
};

export default validateInternal;
