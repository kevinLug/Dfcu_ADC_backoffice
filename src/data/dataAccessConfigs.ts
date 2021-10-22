import { isNullOrEmpty, resolveDotNotationToBracket } from "../utils/objectHelpers";
import { BRANCH_SELECTED_KEY, hasAnyRole, systemRoles } from "./constants";

class DataAccessConfigs {
  static isBranchOfUserSelected(user: any) {
    const result = DataAccessConfigs.getBranchOfUserSelected();
    const role = DataAccessConfigs.roleIsCsoOrBomOrBm(user);
    return !isNullOrEmpty(result) && role;
  }

  static roleIsCsoOrBomOrBm(user: any) {
    return hasAnyRole(user, [systemRoles.CSO]) || hasAnyRole(user, [systemRoles.BM]) || hasAnyRole(user, [systemRoles.BOM]);
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
    return (await fetch(filePath)).json();
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
}

export default DataAccessConfigs;
