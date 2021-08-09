import {useSelector} from "react-redux";
import {IState} from "./types";
import authService from "./oidc/AuthService";
import {IList, List} from "../utils/collections/list";
import {addCheck, IPropsChecks} from "../modules/scan/validate-verify/Check";
import {branches} from "../modules/settings/customClaims/region-data";
import {IKeyValueMap, KeyValueMap} from "../utils/collections/map";
import bankCodes from './bankCodes.json'
import countryCodes from './countryCodes.json'
import {IManualDecision, IWorkflow} from "../modules/workflows/types";

export const AUTH_TOKEN_KEY = '__demo__dfcu__token'
export const AUTH_USER_KEY = '__demo__dfcu__user'

export const systemRoles = {
    BACKOFFICE: 'BACKOFFICE',
    BM: 'BM',
    BOM: 'BOM',
    CMO: 'CMO',
    CSO: 'CSO',
    ADMIN: 'Admin',

}

// BACKOFFICE, BM, CMO, CSO, OR Admin
export const isSystemUser = (user: any): boolean => {
    const roles = [
        systemRoles.BACKOFFICE,
        systemRoles.BM,
        systemRoles.BOM,
        systemRoles.CMO,
        systemRoles.CSO,
        systemRoles.ADMIN,
    ]
    return hasAnyRole(user, roles)
}

export const hasAnyRole = (user: any, roles: string[] = []): boolean => {
    const roleData = user.role;
    const rolesList = roles.map(it => it.toLocaleLowerCase())
    if (typeof roleData === 'string') {
        const userRole = user.role ? user.role.toLocaleLowerCase() : "NA"
        return rolesList.indexOf(userRole) >= 0
    } else {
        const roles = user.role ? user.role.map((it: any) => it.toLocaleLowerCase()) : []
        return roles.some((r: any) => rolesList.indexOf(r) >= 0)
    }
}

// export const csoOrBmRolesForDev = (user:any) => hasAnyRole(user,[systemRoles.CSO]) || hasAnyRole(user,[systemRoles.BM])

export const redux = {
    doLogin: 'DO_LOGIN',
    doLogout: 'DO_LOGOUT',
    doSearch: 'DO_SEARCH',
};

export const localRoutes = {
    callback: '/callback',
    pending: '/pending',
    applications: '/applications',
    applicationsDetails: '/applications/:caseId',
    dashboard: '/dashboard',
    contacts: '/contacts',
    scan: '/scan',
    scanCrop: '/scanCrop',
    homePage: '/',
    initiateTransferRequest: '/initiateTransferRequest',
    contactsDetails: '/contacts/:contactId',
    settings: '/settings',
    customClaimsDetails: '/customClaims/:id',
    customClaims: '/customClaims',
    users: '/users',
    usersDetails: '/users/:userId',
}

const servers: any = {
    dev: {
        // Auth: 'https://localhost:44313',
        Auth: 'https://dfcu-autodatacapture-auth-api-test.test001.laboremus.no',
        // Case: 'http://localhost:6001',
        Case: 'https://dfcu-autodatacapture-casehandling-test.test001.laboremus.no',
        Notification: 'https://dfcu-notification-api-test.test001.laboremus.no',
    },
    test: {
        Auth: 'https://dfcu-autodatacapture-auth-api-test.test001.laboremus.no',
        Case: 'https://dfcu-autodatacapture-casehandling-test.test001.laboremus.no',
        Notification: 'https://dfcu-notification-api-test.test001.laboremus.no',
    },
    visolit: {
        Auth: 'https://dfcu-autodatacapture-auth-api-test.test001.laboremus.no',
        Case: 'https://dfcu-autodatacapture-casehandling-test.test001.laboremus.no',
        Notification: 'https://dfcu-notification-api-test.test001.laboremus.no',
    },
    sit: {
        Auth: 'https://auth-api-test.autodatacapture.dfcugroup.com',
        Case: 'https://casehandling-api-test.autodatacapture.dfcugroup.com',
        Notification: 'https://notification-api-test.autodatacapture.dfcugroup.com',
    },
    uat: {
        Auth: "https://authentication-staging.onboarding.dfcugroup.com",
        Case: "https://casehandling-staging.onboarding.dfcugroup.com",
        Notification: "https://notification-staging.onboarding.dfcugroup.com",
    },
    production: {
        Auth: "https://authentication.onboarding.dfcugroup.com",
        Case: "https://casehandling.onboarding.dfcugroup.com",
        Notification: "https://notification.onboarding.dfcugroup.com",
    }
}


const evVar = process.env.REACT_APP_ENV || 'dev'
export const environment = evVar.trim()
console.log(`############# Env : ${environment} ###############`)
const env = servers[environment]
const authURL = env.Auth
const crmURL = env.Crm
const caseHandlingURL = env.Case
const gatewayURL = env.Gateway
// const notificationURL = env.Notification


export const remoteRoutes = {
    authServer: authURL,
    gatewayUpload: gatewayURL + '/files',
    login: authURL + '/api/test/login',
    profile: authURL + '/api/test/profile',
    register: authURL + '/api/auth/register',
    resetPass: authURL + '/reset',

    workflowsRoot: caseHandlingURL,
    workflowsDocsUpload: caseHandlingURL + '/api/documents/upload',
    workflows: caseHandlingURL + '/api/workflows',

    workflowsCombo: caseHandlingURL + '/api/queries/combo',
    workflowsReports: caseHandlingURL + '/api/report/download',
    documentsDownload: caseHandlingURL + '/api/documents/download',
    workflowsManual: caseHandlingURL + '/api/manual',
    samplePdf: caseHandlingURL + '/sample.pdf',
    gatewayMetadata: gatewayURL + '/api/meta/data',

    users: authURL + '/api/user',
    userClaims: authURL + '/api/User/Claim',
    userMultiClaims: authURL + '/api/multipleClaims',
    userCustomClaims: authURL + '/api/customClaims'

}

export class ConstantLabelsAndValues {

    public static DATE = 'Date'
    public static NAME = 'Name'
    public static FULL_NAME = 'Full name'
    public static EMAIL = 'Email'
    public static BANK_NAME = 'Bank name'
    public static BENEFICIARY_BANK = 'Beneficiary Bank'
    public static BANK = 'Bank'
    public static TELEPHONE = 'Telephone'

    public static NATURE_OF_BUSINESS = 'Nature of business'
    public static CHEQUE_NO = 'Cheque No.'
    public static ACCOUNT_NO = 'A/C No.'
    public static ACCOUNT_NUMBER_FULL = 'Account number'
    public static COUNTRY = 'Country'
    public static COUNTRY_CODE = 'Country code'
    public static ADDRESS = 'Address'
    public static PHYSICAL_ADDRESS = 'Physical address'
    public static TOWN = 'Town'
    public static DISTRICT = 'District'
    public static PLOT = 'Plot'
    public static BUILDING = 'Building'

    public static REQUESTING_BRANCH = 'Requesting branch'
    public static TRANSFER_TYPE = 'Transfer type'
    public static CURRENCY = 'Currency'
    public static AMOUNT = 'Amount'
    public static AMOUNT_IN_WORDS = 'Amount in words'
    public static RATE = 'Rate'
    public static REMITTANCE_AMOUNT = 'Remittance amount'
    public static PURPOSE_OF_TRANSFER = 'Purpose of  transfer'

    public static SORT_CODE = 'Sort code'
    public static SWIFT_CODE = 'Swift code'
    public static IBAN = 'IBAN'
    public static ABA = 'ABA'
    public static IFSC = 'IFSC'
    public static FED_WIRE = 'Fedwire'

    public static APPROVED_BY = 'Approved by:'
    public static REJECTED_BY = 'Rejected by:'
    public static REASON_FOR_REJECTION = 'Reason for rejection:'
    public static SUBMITTED_BY = 'Submitted by:'
    public static CLEARED_BY = 'Cleared by:'

    public static A_MINUTE = 60000
    public static CASE_VALIDATION_INTERNAL = 'INTERNAL'
    public static CASE_VALIDATION_RTGS_1 = 'RTGS1'
    public static CASE_VALIDATION_SWIFT = 'SWIFT'
    public static CASE_VALIDATION_EFT = 'EFT'

    // public static caseValidationCallback(workflowType: string, func: () => any) {
    //     switch (workflowType){
    //         case ConstantLabelsAndValues.CASE_VALIDATION_INTERNAL:
    //             func()
    //             break
    //         case ConstantLabelsAndValues.CASE_VALIDATION_INTERNAL:
    //             func()
    //             break
    //     }
    // }

    public static csoCheckList() {
        const theCheckList = new List<IPropsChecks>();
        theCheckList.add(addCheck("Transfer request is signed as per account mandate", "isTransferSignedAsPerAccountMandate_Bm"))
        theCheckList.add(addCheck("Transfer requires forex", "transferRequiresForex_Bm"))
        theCheckList.add(addCheck("Sender's account number is correct", "isSenderAccountNumberCorrect_Bm"))
        theCheckList.add(addCheck("Sender has sufficient funds", "senderHasSufficientFunds_Bm"))
        theCheckList.add(addCheck("Recipient's bank details are complete", "isRecipientBankDetailsComplete_Bm"))
        theCheckList.add(addCheck("Recipient's physical address is complete", "isRecipientPhysicalAddressComplete_Bm"))
        return theCheckList
    }

    public static csoValidationCheckList(): IList<IPropsChecks> {
        const theCheckList = new List<IPropsChecks>();
        theCheckList.add(addCheck("Transfer request is signed as per account mandate", "isTransferSignedAsPerAccountMandate"))
        theCheckList.add(addCheck("Transfer requires forex", "transferRequiresForex"))
        theCheckList.add(addCheck("Sender's account number is correct", "isSenderAccountNumberCorrect"))
        theCheckList.add(addCheck("Sender has sufficient funds", "senderHasSufficientFunds"))
        theCheckList.add(addCheck("Recipient's bank details are complete", "isRecipientBankDetailsComplete"))
        theCheckList.add(addCheck("Recipient's physical address is complete", "isRecipientPhysicalAddressComplete"))
        // theCheckList.add(addCheck("There are no discrepancies in the amounts", "isDiscrepanciesInAmounts"))
        return theCheckList
    }

    public static bomChecksReviewConfirmation() {
        const theCheckList = new List<IPropsChecks>();
        theCheckList.add(addCheck("Transfer request is signed as per account mandate", "isTransferSignedAsPerAccountMandate_Bm_Confirmation"))
        theCheckList.add(addCheck("Transfer requires forex", "transferRequiresForex_Bm_Confirmation"))
        theCheckList.add(addCheck("Sender's account number is correct", "isSenderAccountNumberCorrect_Bm_Confirmation"))
        theCheckList.add(addCheck("Sender has sufficient funds", "senderHasSufficientFunds_Bm_Confirmation"))
        theCheckList.add(addCheck("Recipient's bank details are complete", "isRecipientBankDetailsComplete_Bm_Confirmation"))
        theCheckList.add(addCheck("Recipient's physical address is complete", "isRecipientPhysicalAddressComplete_Bm_Confirmation"))
        theCheckList.add(addCheck("Confirm that callbacks are done", "isCallbacksDone_Bm_Confirmation")) // todo...must include this
        return theCheckList
    }

    public static bomRemarks() {
        const remarks = new List<string>();
        remarks.add("Instruction is not signed as per mandate");
        remarks.add("Sender's account number is invalid");
        remarks.add("Sender has insufficient funds");
        remarks.add("The recipient's details are incomplete");
        remarks.add("Recipient's physical address is missing");
        remarks.add("Forex details are incorrect");
        remarks.add("Callbacks where not done"); // todo...who is supposed to do the callbacks...guess it's CSO
        return remarks
    }

    public static cmoRemarks() {
        const remarks = new List<string>();
        remarks.add("Instruction is not signed as per mandate");
        remarks.add("Sender's account number is invalid");
        remarks.add("Sender has insufficient funds");
        remarks.add("The recipient's details are incomplete");
        remarks.add("Recipient's physical address is missing");
        remarks.add("Forex details are incorrect");
        remarks.add("Callbacks where not done"); // todo...who is supposed to do the callbacks...guess it's CSO
        return remarks
    }

    public static csoRemarks() {
        const remarks = new List<string>();
        remarks.add("Instruction is not signed as per mandate");
        remarks.add("Sender's account number is invalid");
        remarks.add("Sender has insufficient funds");
        remarks.add("The recipient's details are incomplete");
        remarks.add("Recipient's physical address is missing");
        remarks.add("Forex details are incorrect");
        remarks.add("Callbacks where not done"); // todo...who is supposed to do the callbacks...guess it's CSO
        return remarks
    }

    /**
     * key of BRANCH CODE & value of label (BRANCH NAME)
     */
    public static mapOfDFCUBranchCodeToBranchLabel(): IKeyValueMap<string, string> {
        const map = new KeyValueMap<string, string>()
        branches.map((aBranch) => map.put(aBranch.value, aBranch.label))
        return map
    }

    public static mapOfRecipientBankCodeToValueOfBank(): IKeyValueMap<string, IRecipientBank> {
        const map = new KeyValueMap<string, IRecipientBank>()
        bankCodes.Banks.map((aBank: IRecipientBank) => map.put(aBank.bankCode, aBank))
        return map
    }

    public static mapOfRecipientNameToValueOfBank(): IKeyValueMap<string, IRecipientBank> {
        const map = new KeyValueMap<string, IRecipientBank>()
        bankCodes.Banks.map((aBank: IRecipientBank) => map.put(aBank.bankCode, aBank))
        return map
    }

    public static mapOfRecipientBranchCodeToValueOfBank(): IKeyValueMap<string, IRecipientBank> {
        const map = new KeyValueMap<string, IRecipientBank>()
        bankCodes.Banks.map((aBank: IRecipientBank) => map.put(aBank.branchCode, aBank))
        return map
    }

    public static mapOfCountryCodeToCountryName(): IKeyValueMap<string, string> {
        const map = new KeyValueMap<string, string>()
        countryCodes.map((aCountry) => map.put(aCountry.code, aCountry.name))
        return map;
    }

    public static csoSubmissionDateTimeData(caseId: string) {
        const currentTimestamp = new Date()

        const csoSubmissionDateTimeData = {
            csoSubmissionDateTime: currentTimestamp
        }

        const currentTimestampManual: IManualDecision = {
            caseId: caseId,
            taskName: "cso-approval", // todo ...consider making these constants
            actionName: "update-csoSubmissionDateTime-trigger",
            resumeCase: true,
            nextSubStatus: "csoSubmissionDateTimeSuccessful",
            data: csoSubmissionDateTimeData,
            override: false
        }

        return currentTimestampManual
    }

    public static disableForexDetailsCheck(workflow: IWorkflow, aCheck: IPropsChecks, checks: IList<IPropsChecks>, index: number) {

        return workflow.type !== ConstantLabelsAndValues.CASE_VALIDATION_SWIFT && aCheck.label === checks.get(index).label;
    }


}

export interface IRecipientBank {
    name: string;
    bankCode: string;
    branchCode: string;
}

export interface ICountry {
    name: string;
    Code: string;
}
