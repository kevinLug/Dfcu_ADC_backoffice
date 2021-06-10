import {ITimerDetails, ITimerDetailsMessage} from "../../utils/activeTimeWorker";
import {List} from "../../utils/collections/list";
import ObjectHelpersFluent from "../../utils/objectHelpersFluent";
import validate from "validate.js";
import {testY} from "./rgtsValidationsWorkerDelegation";
// importScripts('foo.js');


const rgtsValidationsWorker = () => {

    // eslint-disable-next-line no-restricted-globals
    self.onmessage = function (e: MessageEvent) {
importScripts('./rgtsValidationsWorkerDelegation.js');
        const data = e.data;
        // console.log('is:',validate.isObject(data))
        console.log("datatatatata:",data)
        const tests = new List<ObjectHelpersFluent>()

testY(data)

        // const dataExists =
            new ObjectHelpersFluent()
            .testTitle("Entire data object presence")
            .selector(data, "$")
            .isPresent()
            .logValue()
            .logTestResult()
            .logTestMessage()
            .logNewLineSpace();
        // tests.add(dataExists);

        // const workflowTypePresent = new ObjectHelpersFluent()
        //     .testTitle("workflowType presence")
        //     .selector(data, "$.workflowType")
        //     .isPresent()
        //     .logValue()
        //     .logTestResult()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(workflowTypePresent);
        //
        // const isRtgs = new ObjectHelpersFluent()
        //     .testTitle("is RTGS the type?")
        //     .selector(data, "$.workflowType")
        //     .isEqualTo("RTGSLOCAL")
        //     .logValue()
        //     .logTestResult()
        //     .logTestMessage()
        //     .logNewLineSpace()
        // tests.add(isRtgs);
        //
        // const isBranchPresent = new ObjectHelpersFluent()
        //     .testTitle("is the branch present?")
        //     .selector(data, "$.caseData.transferDetails.branch")
        //     .isPresent()
        //     .logValue()
        //     .logTestResult()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(isBranchPresent);
        //
        // const isCurrencyPresent = new ObjectHelpersFluent()
        //     .testTitle("is the currency present")
        //     .selector(data, "$.caseData.transferDetails.currency")
        //     .isPresent()
        //     .logValue()
        //     .logTestResult()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(isCurrencyPresent);
        //
        // const isRatePresent = new ObjectHelpersFluent()
        //     .testTitle("is rate present")
        //     .selector(data, "$.caseData.transferDetails.rate")
        //     .isGreaterThanOrEqualTo(0)
        //     .logTestResult()
        //     .logValue()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(isRatePresent)
        //
        // const isAmountPresent = new ObjectHelpersFluent()
        //     .testTitle("Is amount present ( > 0 )")
        //     .selector(data, "$.caseData.transferDetails.amount")
        //     .isGreaterThan(0)
        //     .logTestResult()
        //     .logValue()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(isAmountPresent);
        //
        // const isUgxAmountPresent = new ObjectHelpersFluent()
        //     .testTitle("is UGX amount present ( > 0 )")
        //     .selector(data, "$.caseData.transferDetails.ugxAmount")
        //     .isGreaterThan(0)
        //     .logTestResult()
        //     .logTestMessage()
        //     .logValue()
        //     .logNewLineSpace();
        // tests.add(isUgxAmountPresent);
        //
        // const isBeneficiaryNamePresent = new ObjectHelpersFluent()
        //     .testTitle("is recipient name present?")
        //     .selector(data, "$.caseData.transferDetails.beneficiaryName")
        //     .isPresent()
        //     .logTestResult()
        //     .logValue()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(isBeneficiaryNamePresent);
        //
        // const isRecipientCountryPresent = new ObjectHelpersFluent()
        //     .testTitle("is recipient country present?")
        //     .selector(data, "$.caseData.transferDetails.beneficiaryAddress.country")
        //     .isPresent()
        //     .logTestResult().logValue().logTestMessage().logNewLineSpace();
        // tests.add(isRecipientCountryPresent);
        //
        // const isRecipientPhysicalAddressPresent = new ObjectHelpersFluent()
        //     .testTitle("is recipient's physical address present?")
        //     .selector(data, "$.caseData.transferDetails.beneficiaryAddress.physicalAddress")
        //     .isPresent()
        //     .logTestResult()
        //     .logValue()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(isRecipientPhysicalAddressPresent);
        //
        // const isSenderNamePresent = new ObjectHelpersFluent()
        //     .testTitle("is sender's name present?")
        //     .selector(data, "$.caseData.senderDetails.name")
        //     .isPresent()
        //     .logTestResult()
        //     .logValue()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(isSenderNamePresent);
        //
        // const isSenderEmailPresent = new ObjectHelpersFluent()
        //     .testTitle("is sender's email present?")
        //     .selector(data, "$.caseData.senderDetails.email")
        //     .isPresent()
        //     .logTestResult()
        //     .logValue()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(isSenderEmailPresent);
        //
        // const isSenderAccountNumberPresent = new ObjectHelpersFluent()
        //     .testTitle("is sender's account number present?")
        //     .selector(data, "$.caseData.senderDetails.accountNumber")
        //     .isPresent()
        //     .logTestResult()
        //     .logValue()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(isSenderAccountNumberPresent);
        //
        // const isSenderTelephonePresent = new ObjectHelpersFluent()
        //     .testTitle("is sender's telephone present?")
        //     .selector(data, "$.caseData.senderDetails.telephone")
        //     .isPresent()
        //     .logTestResult()
        //     .logValue()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(isSenderTelephonePresent);
        //
        // const isSenderTownPresent = new ObjectHelpersFluent()
        //     .testTitle("is sender's town present?")
        //     .selector(data, "$.caseData.senderDetails.physicalAddress.town")
        //     .isPresent()
        //     .logTestResult()
        //     .logValue()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(isSenderTownPresent)
        //
        // const isSenderDistrictPresent = new ObjectHelpersFluent()
        //     .testTitle("is sender's district present?")
        //     .selector(data, "$.caseData.senderDetails.physicalAddress.district")
        //     .isPresent()
        //     .logTestResult()
        //     .logValue()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(isSenderDistrictPresent);
        //
        // const isRecipientBankNamePresent = new ObjectHelpersFluent()
        //     .testTitle("is recipient bank name present?")
        //     .selector(data, "$.caseData.bankDetails.beneficiaryBank.bankName")
        //     .isPresent()
        //     .logTestResult()
        //     .logValue()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(isRecipientBankNamePresent);
        //
        // const isRecipientBankAccountPresent = new ObjectHelpersFluent()
        //     .testTitle("is recipient bank account present?")
        //     .selector(data, "$.caseData.bankDetails.beneficiaryBank.accountNumber")
        //     .isPresent()
        //     .logTestResult()
        //     .logValue()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(isRecipientBankAccountPresent);
        //
        // const isRecipientBankSwiftCodePresent = new ObjectHelpersFluent()
        //     .testTitle("is recipient bank swift code present?")
        //     .selector(data, "$.caseData.bankDetails.beneficiaryBank.swiftCode")
        //     .isPresent()
        //     .logTestResult()
        //     .logValue()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(isRecipientBankSwiftCodePresent);
        //
        // const isRecipientBankSortCodePresent = new ObjectHelpersFluent()
        //     .testTitle("is recipient bank sort code present?")
        //     .selector(data, "$.caseData.bankDetails.beneficiaryBank.sortCode")
        //     .isPresent()
        //     .logTestResult()
        //     .logValue()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(isRecipientBankSortCodePresent);
        //
        // const isRecipientBankAbaPresent = new ObjectHelpersFluent()
        //     .testTitle("is recipient bank ABA present?")
        //     .selector(data, "$.caseData.bankDetails.beneficiaryBank.aba")
        //     .isPresent()
        //     .logTestResult()
        //     .logValue()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(isRecipientBankAbaPresent);
        //
        // const isRecipientBankFedWirePresent = new ObjectHelpersFluent()
        //     .testTitle("is recipient bank fed wire present?")
        //     .selector(data, "$.caseData.bankDetails.beneficiaryBank.fedWire")
        //     .isPresent()
        //     .logTestResult()
        //     .logValue()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(isRecipientBankFedWirePresent);
        //
        // const isRecipientBankIbanPresent = new ObjectHelpersFluent()
        //     .testTitle("is recipient bank iban present?")
        //     .selector(data, "$.caseData.bankDetails.beneficiaryBank.iban")
        //     .isPresent()
        //     .logTestResult()
        //     .logValue()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(isRecipientBankIbanPresent);
        //
        // const isTransferPurposePresent = new ObjectHelpersFluent()
        //     .testTitle("is transfer purpose present?")
        //     .selector(data, "$.caseData.bankDetails.correspondingBankDetails.transferPurpose")
        //     .isPresent()
        //     .logTestResult()
        //     .logValue()
        //     .logTestMessage()
        //     .logNewLineSpace();
        // tests.add(isTransferPurposePresent);

        // self.postMessage(outGoingData);


    }
};

let code = rgtsValidationsWorker.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
const blob = new Blob([code], {type: "application/javascript"});
const worker_script_rgtsValidationsWorker = URL.createObjectURL(blob);

// module.exports = worker_script;

export default worker_script_rgtsValidationsWorker