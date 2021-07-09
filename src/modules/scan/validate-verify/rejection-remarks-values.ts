import {IList, List} from "../../../utils/collections/list";
import {hasAnyRole, systemRoles} from "../../../data/constants";
import React from "react";
import store from '../../../data/redux/store'



export interface IRemarks {
    remarks: IList<string>;
    role: string;
    handleRemarkChange?: (event: React.ChangeEvent<any>) => void
}

// todo...remember to add rejected status too ...in status "area"
export const CSORejectionRemarks = () => {
    const remarks = new List<string>();
    remarks.add("Instruction is not signed as per mandate");
    remarks.add("Sender's account number is invalid");
    remarks.add("Sender has insufficient funds");
    remarks.add("The recipient's details are incomplete");
    remarks.add("Recipient's physical address is missing");
    remarks.add("Forex details are incorrect");
    remarks.add("Callbacks where not done"); // todo...who is supposed to do the callbacks...guess it's CSO

    let theRemarks: IRemarks;
    theRemarks = {
        remarks,
        role: systemRoles.CSO
    };

    return theRemarks;
}


export const BMORejectionRemarks = () => {
    const remarks = new List<string>();
    remarks.add("Instruction is not signed as per mandate");
    remarks.add("Sender's account number is invalid");
    remarks.add("Sender has insufficient funds");
    remarks.add("The recipient's details are incomplete");
    remarks.add("Recipient's physical address is missing");
    remarks.add("Forex details are incorrect");
    remarks.add("Callbacks where not done"); // todo...who is supposed to do the callbacks...guess it's CSO

    const user = store.getState().core.user

    let theRemarks: IRemarks;
    let role = ''
    console.log("suuu:",user)





    if (hasAnyRole(user,[systemRoles.BMO])){
        role = systemRoles.BMO
    }

    if (hasAnyRole(user,[systemRoles.BM])){
        role = systemRoles.BM
    }

    theRemarks = {
        remarks,
        role: role // todo...this could be dynamic...pick user from login / jwt
    };

    return theRemarks;
}


export const CMORejectionRemarks = () => {
    const remarks = new List<string>();
    // remarks.add("CSO missed something...");
    // remarks.add("BMO missed something...");
    remarks.add("Instruction is not signed as per mandate");
    remarks.add("Sender's account number is invalid");
    remarks.add("Sender has insufficient funds");
    remarks.add("The recipient's details are incomplete");
    remarks.add("Recipient's physical address is missing");
    remarks.add("Forex details are incorrect");
    remarks.add("Callbacks where not done"); // todo...who is supposed to do the callbacks...guess it's CSO

    let theRemarks: IRemarks;
    theRemarks = {
        remarks,
        role: systemRoles.CMO
    };

    return theRemarks;
}