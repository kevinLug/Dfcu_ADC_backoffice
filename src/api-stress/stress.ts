import {remoteRoutes} from "../data/constants";
import {fakeDembeRequest, fakeLoanRequest, fakeOnBoardRequest} from "./fakeCase";
import {testLogin} from "./login";
import * as superagent from "superagent";


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

// testLogin(({access_token}: any) => {
//     const onBoardCase = fakeOnBoardRequest();
//     postData(access_token, onBoardCase, (resp: any) => {
//         console.log("Submitted data", resp)
//     })
// })

// testLogin(({access_token}: any) => {
//     const loanReq = fakeLoanRequest()
//     postData(access_token, loanReq, (resp: any) => {
//         console.log("Submitted data", resp)
//     })
// })

testLogin(({access_token}: any) => {
    const loanReq = fakeDembeRequest()
    postData(access_token, loanReq, (resp: any) => {
        console.log("Submitted data", resp)
    })
})

