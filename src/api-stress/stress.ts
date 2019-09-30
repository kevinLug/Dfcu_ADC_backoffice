import {remoteRoutes} from "../data/constants";
import {fakeOnBoardRequest} from "./fakeCase";
import {testLogin} from "./login";
import * as superagent from "superagent";


const postData = (token: string, callBack: (data: any) => any) => {
    const onBoardCase = fakeOnBoardRequest();
    superagent.post(remoteRoutes.workflows)
        .set('Authorization', `Bearer ${token}`)
        .send(onBoardCase)
        .end(((err: any, res: any) => {
            if (err) {
                console.error("Error", err)
            } else {
                callBack(res.body)
            }
        }))
}

testLogin(({access_token}: any) => {
    console.log(access_token)
    postData(access_token, (resp: any) => {
        console.log("Submitted data", resp)
    })
})

const fun2 = (data: any) => {
    return data.a + data.b;
}

const fn = (callback: any, data: any) => {
    const result = fun2(data);
    callback(null, result);
}
