import {XHeadCell} from "../../../components/table/XTableHead";
import ContactLink from "../../../components/links/ContactLink";
import {getEmail, getNin, getPhone, renderName} from "../types";
import React from "react";
import EmailLink from "../../../components/links/EmalLink";

export const columns: XHeadCell[] = [
    {
        name: 'id', label: 'Name', render: (value, rec) => <ContactLink id={value} name={renderName(rec)}/>,
        cellProps: {
            style: {
                width: "100%",
                whiteSpace: 'nowrap'
            }
        }
    },
    {
        name: 'category', label: 'Category',
        cellProps: {
            style: {
                width: 100,
                whiteSpace: 'nowrap'
            }
        }
    },
    {
        name: 'tin', label: 'NIN', render: (_, rec) => getNin(rec),
        cellProps: {
            style: {
                width: "100%",
                whiteSpace: 'nowrap'
            }
        }
    },
    {
        name: 'phone', label: 'Phone', render: (_, rec) => getPhone(rec),
        cellProps: {
            style: {
                width: 100,
                whiteSpace: 'nowrap'
            }
        }
    },
    {
        name: 'email', label: 'Email', render: (_, rec) => <EmailLink value={getEmail(rec)}/>,
        cellProps: {
            style: {
                width: 100,
                whiteSpace: 'nowrap'
            }
        }
    },
];
