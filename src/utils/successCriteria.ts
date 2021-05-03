import {IList} from "./collections/list";
import ObjectHelpersFluent from "./objectHelpersFluent";


class SuccessCriteria {

    private static allShouldPass: boolean

    public static testRuns(tests: IList<ObjectHelpersFluent>): boolean {
        let flag = false
        for (let test of tests) {
            if (test.getSummary().testResult) {
                flag = true
                continue
            } else {
                test.logTestMessage()
                console.log(`For selector:`, test.getSummary().selector)
                flag = false
                break
            }
        }
        return flag
    }

}

export default SuccessCriteria