import { determineWorkflowStatus, WorkflowStatus, WorkflowSubStatus } from "../modules/workflows/types";
import Numbers from "../utils/numbers";
import { isNullOrEmpty, resolveDotNotationToBracket } from "../utils/objectHelpers";
import Toast from "../utils/Toast";
import { BRANCH_SELECTED_KEY, ConstantLabelsAndValues, hasAnyRole, systemRoles } from "./constants";

class DataAccessConfigs {
  static currentUrl = window.location.origin;

  static isBranchOfUserSelected(user: any) {
    const result = DataAccessConfigs.getBranchOfUserSelected();
    const role = DataAccessConfigs.roleIsCsoOrBomOrBm(user);
    return !isNullOrEmpty(result) && role;
  }

  static roleIsCsoOrBomOrBm(user: any) {
    return hasAnyRole(user, [systemRoles.CSO]) || hasAnyRole(user, [systemRoles.BM]) || hasAnyRole(user, [systemRoles.BOM]);
  }

  static roleIsCmo(user: any) {
    return user.role.startsWith(systemRoles.CMO);
  }

  static setBranchOfUser(branchName: string, branchCode: string) {
    const branch = {
      branchCode,
      branchName,
    };
    localStorage.setItem(BRANCH_SELECTED_KEY, JSON.stringify(branch));
  }

  static getBranchOfUserSelected() {
    const result = localStorage.getItem(BRANCH_SELECTED_KEY);
    if (result !== null) {
      return result;
    }
    return "";
  }

  static dataViewCsoRole(data: []) {
    function newApplication(record: any) {
      return determineWorkflowStatus(record.status) === WorkflowStatus.Open && record.subStatus === WorkflowSubStatus.AwaitingCSOApproval;
    }
    function submitted(record: any) {
      return determineWorkflowStatus(record.status) === WorkflowStatus.Open && record.subStatus === WorkflowSubStatus.AwaitingBMApproval;
    }
    return data.filter((record: any) => newApplication(record) || submitted(record) || DataAccessConfigs.failedStatus(record));
  }

  static dataViewBomorBmRole(data: []) {
    function pendingBomApproval(record: any) {
      return determineWorkflowStatus(record.status) === WorkflowStatus.Open && record.subStatus === WorkflowSubStatus.AwaitingBMApproval;
    }

    function approvedByBom(record: any) {
      return determineWorkflowStatus(record.status) === WorkflowStatus.Open && record.subStatus === WorkflowSubStatus.AwaitingSubmissionToFinacle;
    }
    return data.filter((record) => pendingBomApproval(record) || approvedByBom(record) || DataAccessConfigs.failedStatus(record));
  }

  static failedStatus(record: any) {
    return determineWorkflowStatus(record.status) === WorkflowStatus.Error;
  }

  static dataViewCmoRole(data: []) {
    function awaitingClearance(record: any) {
      return determineWorkflowStatus(record.status) === WorkflowStatus.Open && record.subStatus === WorkflowSubStatus.AwaitingSubmissionToFinacle;
    }

    function cleared(record: any) {
      return determineWorkflowStatus(record.status) === WorkflowStatus.Closed;
    }

    return data.filter((record: any) => awaitingClearance(record) || cleared(record) || DataAccessConfigs.failedStatus(record));
  }

  static dataView(data: [], user: any) {
    const isCso = DataAccessConfigs.roleIsCso(user);
    const isBomOrBm = DataAccessConfigs.roleIsBomOrBm(user);
    const isCmo = DataAccessConfigs.roleIsCmo(user);

    if (isCso) {
      return DataAccessConfigs.dataViewCsoRole(data);
    }

    if (isBomOrBm) {
      return DataAccessConfigs.dataViewBomorBmRole(data);
    }

    if (isCmo) {
      return DataAccessConfigs.dataViewCmoRole(data);
    }

    return data;
  }

  static roleIsCso(user: any) {
    return hasAnyRole(user, [systemRoles.CSO]);
  }

  static roleIsBomOrBm(user: any) {
    return hasAnyRole(user, [systemRoles.BOM]) || hasAnyRole(user, [systemRoles.BM]);
  }

  static getBranchCode() {
    const result = DataAccessConfigs.getBranchOfUserSelected()!;
    if (!isNullOrEmpty(result)) {
      return JSON.parse(result)["branchCode"];
    }
    return "";
  }

  static getBranchName() {
    const result = DataAccessConfigs.getBranchOfUserSelected()!;
    if (!isNullOrEmpty(result)) {
      return JSON.parse(result)["branchName"];
    }
    return "No branch selected";
  }

  static async shouldCustomerAndCsoHaveSameBranch() {
    const jsonResult = await DataAccessConfigs.fetchConfigFileJson("afterScanRules.json");
    const res: boolean = DataAccessConfigs.getRootObject("root", jsonResult)["shouldCustomerAndCsoHaveSameBranch"];

    await DataAccessConfigs.loadConfigValue("afterScanRules.json", "root", "");

    return res;
  }

  private static getRootObject(objectName: string, jsonResult: any) {
    return jsonResult[objectName];
  }

  static async fetchConfigFileJson(filePath: string) {
    return (
      await fetch(DataAccessConfigs.currentUrl + "/" + filePath, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    ).json();
  }

  static async loadConfigValue(configFileName: string, rootObjectName: string, valuePath: string) {
    const jsonResult = await DataAccessConfigs.fetchConfigFileJson(configFileName);
    const rootObject = DataAccessConfigs.getRootObject(rootObjectName, jsonResult);
    const result = resolveDotNotationToBracket(valuePath, rootObject);
    if (!result) {
      return rootObject;
    }

    return result;
  }

  /**
   * Use this to generate the mailing for BOM/BM and CMO
   */
  static async generateMailingList() {
    let list = [];
    const mailingListRaw: any = await DataAccessConfigs.loadConfigValue("mailingListRaw.json", "root", "mailingListRaw");

    for (const c of ConstantLabelsAndValues.mapOfDFCUBranchLabelToBranchCode()) {
      for (const aUser of mailingListRaw) {
        if (c.key.toLowerCase().includes(aUser.branchCode.toLowerCase())) {
          list.push({
            email: aUser.email,
            role: aUser.role,
            branchCode: c.value,
          });
        }
      }
    }

    return list;
  }

  /**
   * Checks if the user has rights to clear this transfer
   * @param user - the currently logged in user
   * @param transferAmount - the amount being tranfered
   */
  static async cmoAllowedLimits(user: any, transferAmount: number) {
    if (!user) {
      Toast.warn("No user provided to clear transfer");
      throw "process halted!";
    }

    let flag = false;
    if (!user.role) {
      Toast.warn("User has no role specified");
    } else {
      const isUserCmo = DataAccessConfigs.roleIsCmo(user);

      if (isUserCmo) {
        const cmoList: any[] = await DataAccessConfigs.loadConfigValue("cmoAllowedLimits.json", "root", "cmoList");

        for (const aCmo of cmoList) {
          if (user.role.trim().toLowerCase() === aCmo.cmoLimit.roleName.trim().toLowerCase()) {
            const transferAmountLimit = Numbers.unFormat_En_UK_toNumber(aCmo.cmoLimit.limit);
            flag = transferAmount <= transferAmountLimit;
            break;
          }
        }
      }
    }
    return flag;
  }
}

export default DataAccessConfigs;
