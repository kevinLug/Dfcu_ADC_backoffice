import {IApplicantDetails, ISenderDetails} from "../../modules/transfers/types";
import {applicationDetailsLabels} from "../../modules/transfers/typeLabels";

export const fieldsAndValuesInitialValidationByCSO = (senderDetails: IApplicantDetails) => {
    console.log(senderDetails)
    const labels = applicationDetailsLabels(senderDetails);
    let requiredFiledNames: string[] = []
    for (let i of labels) {
        const fieldName = i.key;
        requiredFiledNames.push(fieldName)
    }
    console.log(requiredFiledNames.length)
}