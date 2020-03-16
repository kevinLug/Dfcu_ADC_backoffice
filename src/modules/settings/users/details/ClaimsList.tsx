import React, {useState} from 'react';
import ListView from "../../../../components/dynamic-editor/ListView";
import {IColumn, InputType} from "../../../../components/dynamic-editor/types";
import {toOptions} from "../../../../components/inputs/inputHelpers";
import EditDialog from "../../../../components/EditDialog";
import EditForm from "../../../../components/dynamic-editor/EditForm";
import {remoteRoutes} from "../../../../data/constants";

interface IProps {
    data: any[]
    user: any
}

export const authEditableClaims = ["phone_number", "region", "branch_name", "agent_code"]
const columns: IColumn[] = [
    {
        name: 'claimType', label: 'Claim Type',
        inputType: InputType.Select,
        inputProps: {
            options: toOptions(authEditableClaims),
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

    const [data, setData] = useState<any []>(props.data)
    const [selected, setSelected] = useState<any | null>(null)
    const [dialog, setDialog] = useState(false)

    const handleEdit = (dt: any) => {
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

    function handleAdded(dt: any) {
        setData([...data, dt])
        handleClose()
    }

    function handleEdited(dt: any) {
        const newData = data.map(it => it.id === dt.id ? dt : it)
        setData(newData)
        handleClose()
    }

    function handleDeleted(dt: any) {
        const newData = data.filter(it => it.id !== dt.id)
        setData(newData)
        handleClose()
    }

    const isNew = !selected
    return (
        <div>
            <ListView
                title='User Claims'
                data={data}
                columns={columns}
                primaryKey='id'
                onAdd={handleAdd}
                onDelete={handleEdit}
                onEdit={handleEdit}
            />
            <EditDialog open={dialog} onClose={handleClose} title={isNew ? "New claim":"Edit claim"}>
                <EditForm
                    columns={columns}
                    url={remoteRoutes.userClaims}
                    data={isNew ? {userId: props.user.id} : selected}
                    isNew={isNew}
                    onNew={handleAdded}
                    onEdited={handleEdited}
                    onDeleted={handleDeleted}
                />
            </EditDialog>
        </div>
    );
}


export default ClaimsList;
