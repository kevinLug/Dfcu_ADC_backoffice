import {ICase} from "../transfers/types";
import {RequestType} from "../workflows/config";
import validateRTGS from "../transfers/rtgsValidations";

import validateEft from "../transfers/eftValidations";
import validateSwift from "../transfers/swiftValidations";

import validateInternal from "../transfers/internalValidations";

const validateData = (data: ICase): Promise<boolean> => {

    switch (data.workflowType) {
        case RequestType.RTGS_1:
            return validateRTGS(data);
        case RequestType.EFT:
            return validateEft(data);
        case RequestType.SWIFT:
            return validateSwift(data);
        case RequestType.INTERNAL:
            return validateInternal(data);
        default:
            return new Promise<boolean>((resolve, reject) => reject(false));

    }
}

export default validateData;