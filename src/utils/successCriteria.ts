import { IList, List } from "./collections/list";
import ObjectHelpersFluent, { ITestDataSummary } from "./objectHelpersFluent";
import { IKeyValueMap, KeyValueMap } from "./collections/map";
import { environment } from "../data/constants";

class SuccessCriteria {
  private static successCriteriaSummaryList: IList<ITestDataSummary> = new List<ITestDataSummary>();
  private static successCriteriaSummarySet: IKeyValueMap<string, IList<ITestDataSummary>> = new KeyValueMap<string, IList<ITestDataSummary>>();

  public static getSuccessCriteriaSummaryList() {
    return SuccessCriteria.successCriteriaSummaryList;
  }

  public static getSuccessCriteriaSummarySet() {
    return SuccessCriteria.successCriteriaSummarySet;
  }

  public static resetSuccessCriteriaSummaryList() {
    SuccessCriteria.successCriteriaSummaryList.clear();
  }

  public static resetSuccessCriteriaSummarySet() {
    SuccessCriteria.successCriteriaSummarySet.clear();
  }

  public static getPassedTestResults(testSetName: string) {
    const collection = new List<ITestDataSummary>();
    const list = SuccessCriteria.successCriteriaSummarySet.get(testSetName);
    // @ts-ignore
    for (const listElement of list) {
      if (listElement.testResult) {
        collection.add(listElement);
      }
    }
    return collection;
  }

  public static getFailedTestResults(testSetName: string) {
    const collection = new List<ITestDataSummary>();
    const list = SuccessCriteria.successCriteriaSummarySet.get(testSetName);
    // @ts-ignore
    for (const listElement of list) {
      if (!listElement.testResult) {
        collection.add(listElement);
      }
    }
    return collection;
  }

  private static addToSuccessCriteriaSummaryList(result: ITestDataSummary) {
    if (SuccessCriteria.successCriteriaSummaryList.size() === 0) {
      const first = new List<ITestDataSummary>();
      first.add(result);
      SuccessCriteria.successCriteriaSummaryList = first;
    } else {
      SuccessCriteria.successCriteriaSummaryList.add(result);
    }
  }

  private static addToSuccessCriteriaSummarySet(testSetName: string, result: IList<ITestDataSummary>) {
    if (SuccessCriteria.successCriteriaSummarySet.size() === 0) {
      const first = new KeyValueMap<string, IList<ITestDataSummary>>();
      first.put(testSetName, result);
      SuccessCriteria.successCriteriaSummarySet = first;
    } else {
      SuccessCriteria.successCriteriaSummarySet.put(testSetName, result);
    }
  }

  public static testRuns(tests: IList<ObjectHelpersFluent>, testSetName: string, shouldBreakIfFalse?: boolean): boolean {
    for (let test of tests) {
      const env = environment.toLowerCase();
      if (env === "dev" || env === "development" || env === "test" || env === "Test") {
        console.log("the tests: ", test.getSummary());
      }

      if (test.getSummary().testResult) {
        SuccessCriteria.addToSuccessCriteriaSummaryList(test.getSummary());
      } else {
        SuccessCriteria.addToSuccessCriteriaSummaryList(test.getSummary());

        if (shouldBreakIfFalse) {
          if (env === "dev" || env === "development" || env === "test" || env === "Test") {
            console.log("process halted here...!!!");
          }
          break;
        }
      }
    }

    SuccessCriteria.addToSuccessCriteriaSummarySet(testSetName, SuccessCriteria.successCriteriaSummaryList);

    // return flag
    return SuccessCriteria.getFailedTestResults(testSetName).size() === 0;
  }
}

export default SuccessCriteria;
