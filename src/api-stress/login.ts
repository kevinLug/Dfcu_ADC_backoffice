import * as superagent from "superagent";
import {remoteRoutes} from "../data/constants";

const authService = remoteRoutes.authServer
const authData = {
    client_id: 'casehandling',
    client_secret: 'casehandling@lug',
    grant_type: 'client_credentials',
    scope: 'Crm Notifications KycConnector Accounts CaseHandling',
}

export const testLogin = (callBack: (data: any) => any) => {
    superagent.post(authService)
        .type('form')
        .send(authData)
        .end(((err, res) => {
            if (err) {
                console.error(err.error)
            } else {
                callBack(res.body)
            }
        }))
}
