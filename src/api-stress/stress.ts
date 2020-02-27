import {remoteRoutes} from "../data/constants";
import {doLogin} from "./login";
import * as superagent from "superagent";
import {fakeEntityRequest, fakeIndividualRequest, fakeJointRequest, fakeOtherRequest} from "./test-joint";
import {createJsonFile, createZipFile, uploadFile} from "./test-files";


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



function runInd(token:string){
    const loanReq = fakeIndividualRequest()
    postData(token, loanReq, (resp: any) => {
        console.log("Submitted Individual", resp)
    })
}
function runJnt(token:string){
    const loanReq = fakeJointRequest()
    postData(token, loanReq, (resp: any) => {
        console.log("Submitted Joint", resp)
    })
}

function runEntity(token:string){
    const loanReq = fakeEntityRequest()
    postData(token, loanReq, (resp: any) => {
        console.log("Submitted Entity", resp)
    })
}

function runOther(token:string){
    const loanReq = fakeOtherRequest()
    postData(token, loanReq, (resp: any) => {
        console.log("Submitted Other", resp)
    })
}

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';
doLogin(({access_token}: any) => {
    for (let i = 0; i < 1; i++) {
        runInd(access_token)
        runJnt(access_token)
        runEntity(access_token)
        runOther(access_token)
    }
})

// console.log("!!!Dfcu Stress test!!!")
// const max = 1
// console.log(`### Running ${max} Tests ###`)
// doLogin(({access_token}) => {
//     console.log("### Got Access Token ###")
//     for (let i = 0; i < max; i++) {
//         const loanReq = fakeOtherRequest()
//         createJsonFile(loanReq,() => {
//             console.log(`### ${i} Created JSON File ###`)
//             createZipFile(() => {
//                 console.log(`### ${i} Created ZIP with all files ###`)
//                 uploadFile(access_token,()=>{
//                     console.log(`### ${i} Done With Request ###`)
//                 })
//             })
//         })
//     }
// })

