import {ICase} from "../transfers/types";
import {RequestType} from "../workflows/config";
import validateRTGS from "../transfers/rtgsValidations";
import validateForeignRemittance from "../transfers/foreignRemittanceValidations";

const validateData = (data: ICase): Promise<boolean> => {
    switch (data.workflowType) {
        case RequestType.RTGS_LOCAL:
            return validateRTGS(data);
        case RequestType.FOREIGN_REMITTANCE:
            return validateForeignRemittance(data);
        default:
            return new Promise<boolean>((resolve, reject) => reject(false));
    }
}

export default validateData;