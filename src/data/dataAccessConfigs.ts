import { isNullOrEmpty } from "../utils/objectHelpers";
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
    return JSON.parse(result)["branchName"];
  }
}

export default DataAccessConfigs;
