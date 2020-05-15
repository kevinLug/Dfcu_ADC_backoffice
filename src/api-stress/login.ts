import * as superagent from "superagent";
import {remoteRoutes} from "../data/constants";
import {GatewayMetadata} from "../data/types";

const authService = remoteRoutes.authServer
const authData = {
    client_id: 'casehandling',
    client_secret: 'casehandling@lug',
    grant_type: 'client_credentials',
    scope: 'CaseHandling Gateway',
}

export const login = async (): Promise<any> => {
    const resp = await superagent.post(authService + '/connect/token')
        .type('form')
        .send(authData)
    return resp.body
}


export const readMetadata = async (token:string): Promise<GatewayMetadata> => {
    const resp = await superagent.get(remoteRoutes.gatewayMetadata)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send()
    return resp.body
}
