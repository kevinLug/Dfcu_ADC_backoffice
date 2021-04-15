import {ISenderDetails, senderDetailsLabels} from "../../modules/transfers/types";

export const fieldsAndValuesInitialValidationByCSO = (senderDetails: ISenderDetails) => {
    console.log(senderDetails)
    const labels = senderDetailsLabels(senderDetails);
    let requiredFiledNames: string[] = []
    for (let i of labels) {
        const fieldName = i.key;
        requiredFiledNames.push(fieldName)
    }
    console.log(requiredFiledNames.length)
}