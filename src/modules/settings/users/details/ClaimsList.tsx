import React, {useState} from 'react';
import ListView from "../../../../components/dynamic-editor/ListView";
import {IColumn, InputType} from "../../../../components/dynamic-editor/types";
import {toOptions} from "../../../../components/inputs/inputHelpers";
import {addressCategories} from "../../../../data/comboCategories";
import EditDialog from "../../../../components/EditDialog";
import EditForm from "../../../../components/dynamic-editor/EditForm";
import {IAddress} from "../../../contacts/types";
import {remoteRoutes} from "../../../../data/constants";

interface IProps {
    data: any[]
}

/*
    "id": 0,
    "userId": "string",
    "claimType": "string",
    "claimValue": "string"
 */


export const claims = ["phone", "region", "branch", "agent_code"]
const columns: IColumn[] = [
    {
        name: 'claimType', label: 'Claim Type',
        inputType: InputType.Select,
        inputProps: {
            options: toOptions(claims),
            variant: 'outlined'
        }
    },
    {
        name: 'claimValue', label: 'Claim Value',
        inputType: InputType.Text,
        inputProps: {
            type: 'text',
            variant: 'outlined'
        }
    }
]


const ClaimsList = (props: IProps) => {

    const [selected, setSelected] = useState<any | null>(null)
    const [dialog, setDialog] = useState(false)

    const handleEdit = (dt: any) => () => {
        console.log("On edit", dt)
        setSelected(dt)
        setDialog(true)
    }

    const handleClose = () => {
        setDialog(false)
        setSelected(null)
    }

    const handleAdd = () => {
        setSelected(null)
        setDialog(true)
    }

    function handleAdded(data:any) {
        console.log("Claim added", data)
    }

    function handleEdited(data:any) {
        console.log("Claim Edited", data)
    }

    return (
        <div>
            <ListView
                title='User Claims'
                data={props.data}
                columns={columns}
                primaryKey='id'
                onAdd={handleAdd}
                onDelete={handleEdit}
                onEdit={handleEdit}
            />
            <EditDialog open={dialog} onClose={handleClose} title='Edit Claim'>
                <EditForm
                    columns={columns}
                    url={remoteRoutes.userClaims}
                    data={selected}
                    isNew={!selected}
                    onNew={handleAdded}
                    onEdited={handleEdited}
                />
            </EditDialog>
        </div>
    );
}


export default ClaimsList;
