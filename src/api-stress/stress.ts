import {remoteRoutes} from "../data/constants";
import {login, readMetadata} from "./login";
import * as superagent from "superagent";
import {fakeEntityRequest, fakeIndividualRequest, fakeJointRequest, fakeOtherRequest} from "./test-joint";
import {createJsonFile, createZipFile, uploadFile, uploadZipAsync} from "./test-files";
import {getGatewayDocsList} from "../modules/workflows/actions/templates/verify-documents/helpers";
import {AccountCategory, GatewayDocument, GatewayMetadata} from "../data/types";


const postData = (token: string, requestData: any, callBack: (data: any) => any) => {
    superagent.post(remoteRoutes.workflows)
        .set('Authorization', `Bearer ${token}`)
        .send(requestData)
        .end(((err: any, res: any) => {
            if (err) {
                console.error("Error", err)
            } else {
                callBack(res.body)
            }
        }))
}


function runCaseDirect(token: string, type: RequestType, accountCategories: AccountCategory[]) {
    const loanReq = getCaseData(type, accountCategories)
    postData(token, loanReq, (resp: any) => {
        console.log(`Submitted ${type}`, resp)
    })
}


function getCaseData(type: RequestType, accountCategories: AccountCategory[]): any {
    const cat = accountCategories.filter(it => it.code.toLocaleLowerCase() === type.toLocaleLowerCase())[0]
    const accountsList: string[] = cat.accounts.map(it => it.code)
    let caseData: any = {}
    if (type === RequestType.Individual)
        caseData = fakeIndividualRequest(accountsList)
    if (type === RequestType.Joint)
        caseData = fakeJointRequest(accountsList)
    if (type === RequestType.Entity)
        caseData = fakeEntityRequest(accountsList)
    if (type === RequestType.Other)
        caseData = fakeOtherRequest(accountsList)
    return caseData
}


async function runCase(token: string, metadata: GatewayMetadata, type: RequestType): Promise<any> {
    const data = getCaseData(type, metadata.accountCategories)
    const wfType = data.workflowType
    const productType = data.caseData.metaData.product
    const docsList = getGatewayDocsList(wfType, productType, metadata.accountCategories)
    createJsonFile(data)
    const zipFile = createZipFile(docsList)
    await uploadZipAsync(token, zipFile)
}

enum RequestType {
    Individual = 'individual',
    Joint = 'joint',
    Other = 'other',
    Entity = 'entity'
}

async function run(reqCount: number, type: RequestType): Promise<any> {
    const {access_token} = await login()
    console.log("Got token")
    const metaData = await readMetadata(access_token)
    console.log("Got Metadata")
    for (let i = 0; i < reqCount; i++) {
        await runCase(access_token, metaData, type)
    }
}


run(1, RequestType.Entity)
    .then(r =>
        console.log("Done uploading", r)
    )
    .catch(e => {
        console.error(e)
    })

