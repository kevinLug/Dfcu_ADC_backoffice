import {IList} from "../../../utils/collections/list";
import {ConstantLabelsAndValues, hasAnyRole, systemRoles} from "../../../data/constants";
import React from "react";
import store from '../../../data/redux/store'

export interface IRemarks {
    remarks: IList<string>;
    role: string;
    handleRemarkChange?: (event: React.ChangeEvent<any>) => void
}

// todo...remember to add rejected status too ...in status "area"
export const CSORejectionRemarks = () => {
    const remarks = ConstantLabelsAndValues.csoRemarks();

    let theRemarks: IRemarks;
    theRemarks = {
        remarks,
        role: systemRoles.CSO
    };

    return theRemarks;
}


export const BMORejectionRemarks = () => {
    const remarks = ConstantLabelsAndValues.bomRemarks()

    const user = store.getState().core.user

    let theRemarks: IRemarks;
    let role = ''

    if (hasAnyRole(user, [systemRoles.BOM])) {
        role = systemRoles.BOM
    }

    if (hasAnyRole(user, [systemRoles.BM])) {
        role = systemRoles.BM
    }

    theRemarks = {
        remarks,
        role: role // todo...this could be dynamic...pick user from login / jwt
    };

    return theRemarks;
}

//
export const CMORejectionRemarks = () => {
    const remarks = ConstantLabelsAndValues.cmoRemarks()
    let theRemarks: IRemarks;
    theRemarks = {
        remarks,
        role: systemRoles.CMO
    };

    return theRemarks;
}