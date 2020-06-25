import {XHeadCell} from "../../../components/table/XTableHead";
import ContactLink from "../../../components/links/ContactLink";
import {getNin, getPhone, IContact, renderName} from "../types";
import React from "react";

export const columns: XHeadCell[] = [
    {
        name: 'name', label: 'Name', render: (value, rec) => <ContactLink id={rec.id} name={value}/>,
        cellProps: {
            style: {
                whiteSpace: 'nowrap'
            }
        }
    },
    {
        name: 'gender', label: 'Gender',
        cellProps: {
            style: {
                whiteSpace: 'nowrap'
            }
        }
    },
    {
        name: 'nin', label: 'NIN',
        cellProps: {
            style: {
                whiteSpace: 'nowrap'
            }
        }
    },
    {
        name: 'phone', label: 'Phone',
        cellProps: {
            style: {
                whiteSpace: 'nowrap'
            }
        }
    }
];

export const parseContacts = (data:IContact[])=>{
    return data.map(it=>{
        return{
            id: it.id,
            phone: getPhone(it),
            gender: it.person.gender,
            nin: getNin(it),
            name: renderName(it),
        }
    })
}
