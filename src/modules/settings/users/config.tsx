import React from "react";
import {XHeadCell} from "../../../components/table/XTableHead";
import UserLink from "../../../components/links/UserLink";
import {parseXpath} from "../../../utils/jsonHelpers";
import {hasNoValue} from "../../../components/inputs/inputHelpers";

const isMatch = (data: string, q: string) => {
    return data.toLocaleLowerCase().indexOf(q.toLocaleLowerCase()) >= 0
}

export function localFilter(data: any, value: string) {
    if (hasNoValue(value)) {
        return true
    }
    const name: string = parseXpath(data, "claims.name") || data.preferredUsername || ''
    const email: string = parseXpath(data, "claims.email") || data.email || ''
    return isMatch(email, value) || isMatch(name, value);
}

export const columns: XHeadCell[] = [
    {
        name: 'claims.name', label: 'Name', render: (value, rec) =>
            <UserLink id={rec.id} name={value || rec.preferredUsername}/>,
        cellProps: {
            style: {
                whiteSpace: 'nowrap'
            }
        }
    },
    {
        name: 'claims.email', label: 'Email',
        cellProps: {
            style: {
                whiteSpace: 'nowrap'
            }
        }
    },
    {
        name: 'claims.phone_number', label: 'Phone',
        cellProps: {
            style: {
                whiteSpace: 'nowrap'
            }
        }
    },
    {
        name: 'claims.region', label: 'Region Code',
        cellProps: {
            style: {
                whiteSpace: 'nowrap'
            }
        }
    },
    {
        name: 'claims.branch_name', label: 'Branch SolId',
        cellProps: {
            style: {
                whiteSpace: 'nowrap'
            }
        }
    },
    {
        name: 'claims.agent_code', label: 'Agent Code',
        cellProps: {
            style: {
                whiteSpace: 'nowrap'
            }
        }
    },
];
