import { remoteRoutes } from "../../data/constants";
import { search } from "../../utils/ajax";
import { backDateFromCurrentDate, getDateWithoutTimeAttached, printStdDate } from "../../utils/dateHelpers";
import Toast from "../../utils/Toast";
import { ICase } from "../transfers/types";
import { IWorkflowFilter } from "../workflows/types";

class DuplicationCheckHandler {
  private setFilterParams(setLoading: (loading: boolean) => void, setLoadingMessage: (msg: string) => void, aCase: ICase): Promise<IWorkflowFilter> {
    const backDate = backDateFromCurrentDate(7);
    const fromSevenDaysBack: any = getDateWithoutTimeAttached(backDate);
    const from = printStdDate(fromSevenDaysBack);

    const filterParameters: IWorkflowFilter = {
      applicantName: aCase.caseData.applicantDetails.fullName,
      applicantAccountNumber: aCase.caseData.applicantDetails.accountNumber,

      beneficiaryName: aCase.caseData.beneficiaryDetails.fullName,
      beneficiaryAccountNumber: aCase.caseData.beneficiaryDetails.accountNumber,

      isDuplicateSearch: true,
    };

    setLoading(true);
    setLoadingMessage("Running duplication checks");
    return Promise.resolve(filterParameters);
  }

  public async performDuplicationCheck(setLoading: (loading: boolean) => void, setLoadingMessage: (msg: string) => void, aCase: ICase, setDuplicationData: (data: []) => void) {
    const newFilter = await this.setFilterParams(setLoading, setLoadingMessage, aCase);

    setTimeout(() => {
      Toast.info("Running duplication checks...");
    }, 1000);

    const p1 = new Promise<[]>((resolve, reject) => {
      search(
        remoteRoutes.workflows,
        newFilter,
        (resp) => {
          resolve(resp);
        },
        undefined,
        () => setLoading(false)
      );
    }).then((r) => {
      return r;
    });

    return Promise.all([p1]);
  }
}

export default DuplicationCheckHandler;
