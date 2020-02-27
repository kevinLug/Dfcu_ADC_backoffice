import * as superagent from "superagent";
import {remoteRoutes} from "../data/constants";

const authService = remoteRoutes.authServer
const authData = {
    client_id: 'casehandling',
    client_secret: 'casehandling@lug',
    grant_type: 'client_credentials',
    scope: 'CaseHandling Gateway',
}

export const doLogin = (callBack: (data: any) => any) => {
    superagent.post(authService+'/connect/token')
        .type('form')
        .send(authData)
        .end(((err, res) => {
            if (err) {
                console.error("Login error",err)
            } else {
                callBack(res.body)
            }
        }))
}
