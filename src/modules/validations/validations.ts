import {ICase} from "../transfers/types";
import {RequestType} from "../workflows/config";
import validateRTGS from "../transfers/rtgsValidations";

const validateData = (data: ICase): Promise<boolean> => {
    switch (data.workflowType) {
        case RequestType.RTGS:
            return validateRTGS(data);
        default:
            return new Promise<boolean>((resolve, reject) => reject(false));
    }
}

export default validateData;