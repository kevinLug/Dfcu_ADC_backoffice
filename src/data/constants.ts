export const AUTH_TOKEN_KEY = '__demo__dfcu__token'
export const AUTH_USER_KEY = '__demo__dfcu__user'

export const systemRoles = {

    BACKOFFICE: 'BACKOFFICE',
    BM:'BM',
    CMO:'CMO',
    CSO:'CSO',
    ADMIN: 'Admin',

}
// BACKOFFICE, BM, CMO, CSO, OR Admin
export const isSystemUser = (user: any): boolean => {
    const roles = [
        systemRoles.BACKOFFICE,
        systemRoles.BM,
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
    contactsDetails: '/contacts/:contactId',
    settings: '/settings',
    customClaimsDetails: '/customClaims/:id',
    customClaims: '/customClaims',
    users: '/users',
    usersDetails: '/users/:userId',
}

const servers: any = {
    dev: {
        Auth: 'https://dfcu-autodatacapture-auth-api-test.test001.laboremus.no',
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
        Auth: 'https://authentication-test.onboarding.dfcugroup.com',
        Case: 'https://casehandling-test.onboarding.dfcugroup.com/',
        Notification: 'https://notification-test.onboarding.dfcugroup.com',
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
    contacts: crmURL + '/api/contact',
    contactSearch: crmURL + '/api/contact/search',
    contactById: crmURL + '/api/contact/id',
    contactsPerson: crmURL + '/api/person',
    contactsChc: crmURL + '/api/person/chc',
    contactsEmail: crmURL + '/api/email',
    contactsTag: crmURL + '/api/tag',
    contactsUrl: crmURL + '/api/url',
    contactsPhone: crmURL + '/api/phone',
    contactsAddress: crmURL + '/api/address',
    contactsIdentification: crmURL + '/api/identification',

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



