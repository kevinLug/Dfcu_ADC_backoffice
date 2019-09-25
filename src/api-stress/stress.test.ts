import {post} from "../utils/ajax";
import {remoteRoutes} from "../data/constants";
import {fakeOnBoardRequest} from "./fakeCase";

it('chunkArray can split an array', () => {
    const onBoardCase = fakeOnBoardRequest();
    post(remoteRoutes.workflows,onBoardCase,res=>{
        console.log(res)
    })
});
