import React from 'react';
import ListView from "../../../../components/dynamic-editor/ListView";
import {IColumn} from "../../../../components/dynamic-editor/types";

interface IProps {
    data: any[]
}

/*
    "id": 0,
    "userId": "string",
    "claimType": "string",
    "claimValue": "string"
 */

const columns: IColumn[] = [
    {name: 'claimType', label: 'Claim Type'},
    {name: 'claimValue', label: 'Claim Value'}
]

const ClaimsList = (props: IProps) => {

    function handleAdd() {

    }

    function handleEdit(data: any) {
        console.log("On edit", data)
    }

    function handleDelete(data: any) {
        console.log("On delete", data)
    }

    return (
        <div>
            <ListView
                title='User Claims'
                data={props.data}
                columns={columns}
                primaryKey='id'
                onAdd={handleAdd}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </div>
    );
}


export default ClaimsList;
