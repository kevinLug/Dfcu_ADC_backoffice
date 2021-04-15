import {remoteRoutes} from "../data/constants";
import {login, readMetadata} from "./login";
import * as superagent from "superagent";
import {fakeRTGSRequest} from "./test-joint";
import {createJsonFile, createZipFile, uploadZipAsync} from "./test-files";
import {getGatewayDocsList} from "../modules/workflows/actions/templates/verify-documents/helpers";
import {TransferCategory, GatewayMetadata} from "../data/types";

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

// direct to workflow
function runCaseDirect(token: string, type: RequestType, transferCategories: TransferCategory[]) {
    const loanReq = getCaseData(type, transferCategories)
    postData(token, loanReq, (resp: any) => {
        console.log(`Submitted ${type}`, resp)
    })
}

function getCaseData(type: RequestType, transferCategories: TransferCategory[]): any {
    // const cat = transferCategories.filter(it => it.name.toLocaleLowerCase() === type.toLocaleLowerCase())[0]
    // const transfersList: string[] = cat.accounts.map(it => it.code)
    let caseData: any = {}
    if (type === RequestType.RTGS)
        caseData = fakeRTGSRequest()
        // caseData = fakeIndividualRequest(accountsList)
    // if (type === RequestType.Joint)
    //     caseData = fakeJointRequest(accountsList)
    // if (type === RequestType.Entity)
    //     caseData = fakeEntityRequest(accountsList)
    // if (type === RequestType.Other)
    //     caseData = fakeOtherRequest(accountsList)

        console.log('the case data:',JSON.stringify(caseData, null, 2))
        console.log('the case data --> applicants:',caseData['applicants'])

    return caseData
}


async function runCase(token: string, metadata: GatewayMetadata, type: RequestType): Promise<any> {
    const data = getCaseData(type, metadata.transferCategories)
    const wfType = data.workflowType
    const productType = data.caseData.metaData.product
    const docsList = getGatewayDocsList(wfType, productType, metadata.transferCategories)
    createJsonFile(data)
    const zipFile = createZipFile(docsList)
    await uploadZipAsync(token, zipFile)
}

export enum RequestType {

    ForeignRemittance = 'foreignRemittance',
    EFT = 'EFT',
    RTGSLocal = 'RTGSLocal',
    RTGS = 'RTGS',
    EAPS = 'EAPS',
    REPSS = 'REPSS',
    ForeignDraft = 'foreignDraft',

}

export async function run(reqCount: number, type: RequestType,direct=false): Promise<any> {
    const {access_token} = await login()
    console.log("Got token")
    const metaData = await readMetadata(access_token)
    console.log("Got Metadata")
    if(direct){
        console.log('running direct...')
        for (let i = 0; i < reqCount; i++) {
            await runCaseDirect(access_token, type, metaData.transferCategories)
        }
    }else {
        console.log('running indirect...')
        for (let i = 0; i < reqCount; i++) {
            await runCase(access_token, metaData, type)
        }
    }
}

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';
run(1, RequestType.RTGS,true)
    .then(r =>
        console.log("Done uploading", r)
    )
    .catch(e => {
        console.error(e)
    })
