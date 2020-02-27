import {XHeadCell} from "../../../components/table/XTableHead";
import ContactLink from "../../../components/links/ContactLink";
import {getNin, getPhone, renderName} from "../types";
import React from "react";

export const columns: XHeadCell[] = [
    {
        name: 'id', label: 'Name', render: (value, rec) => <ContactLink id={value} name={renderName(rec)}/>,
        cellProps: {
            style: {
                whiteSpace: 'nowrap'
            }
        }
    },
    {
        name: 'gender', label: 'Gender',
        render: (value, rec) => rec.person.gender,
        cellProps: {
            style: {
                whiteSpace: 'nowrap'
            }
        }
    },
    {
        name: 'tin', label: 'NIN', render: (_, rec) => getNin(rec),
        cellProps: {
            style: {
                whiteSpace: 'nowrap'
            }
        }
    },
    {
        name: 'phone', label: 'Phone', render: (_, rec) => getPhone(rec),
        cellProps: {
            style: {
                whiteSpace: 'nowrap'
            }
        }
    }
];
