import {IList} from "./collections/list";
import ObjectHelpersFluent from "./objectHelpersFluent";


class SuccessCriteria {
    public static testRuns(tests: IList<ObjectHelpersFluent>): boolean {
        let flag = false
        for (let test of tests) {
            if (test.getSummary().testResult) {
                flag = true
                console.log(`For selector:`, test.getSummary().selector)
            } else {
                test.logTestMessage()
                console.log(`For selector:`, test.getSummary().selector)
                flag = false
                console.log("process halted here...!!!")
                break
            }
        }
        return flag
    }

}

export default SuccessCriteria