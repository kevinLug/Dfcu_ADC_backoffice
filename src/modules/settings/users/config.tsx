import React from "react";
import {XHeadCell} from "../../../components/table/XTableHead";
import UserLink from "../../../components/links/UserLink";
import {parseXpath} from "../../../utils/jsonHelpers";
import {hasNoValue} from "../../../components/inputs/inputHelpers";

export function localFilter(data: any, value: string) {
    if (hasNoValue(value)) {
        return true
    }
    const dt: string = parseXpath(data, "claims.name") || data.preferredUsername || ''
    return dt.indexOf(value) >= 0
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
        name: 'claims.phone', label: 'Phone',
        cellProps: {
            style: {
                whiteSpace: 'nowrap'
            }
        }
    },
    {
        name: 'claims.region', label: 'Region',
        cellProps: {
            style: {
                whiteSpace: 'nowrap'
            }
        }
    },
    {
        name: 'claims.branch', label: 'Branch',
        cellProps: {
            style: {
                whiteSpace: 'nowrap'
            }
        }
    },
];
