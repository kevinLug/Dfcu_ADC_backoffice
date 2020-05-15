import React, {useState} from 'react';
import ListView from "../../../../components/dynamic-editor/ListView";
import {IColumn, InputType} from "../../../../components/dynamic-editor/types";
import EditDialog from "../../../../components/EditDialog";
import EditForm from "../../../../components/dynamic-editor/EditForm";
import {localRoutes, remoteRoutes} from "../../../../data/constants";
import {authCustomClaims} from "../../customClaims/config";
import {IUserClaim} from "../types";
import {useHistory} from "react-router";
import ClaimEditorForm from "./ClaimEditorForm";

interface IProps {
    data: IUserClaim[]
    user: any
}


const columns: IColumn[] = [
    {
        name: 'claimType', label: 'Claim Type',
        inputType: InputType.Select,
        inputProps: {
            options: authCustomClaims.map(({name, label}) => ({label, value: name})),
            variant: 'outlined'
        },
        render: (v) => {
            const claim = authCustomClaims.find(it => it.name === v)
            return claim ? claim.label : v
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

const getColumns = (claim: IUserClaim):IColumn[] => {
    return [
        {
            name: 'claimType', label: 'Claim Type',
            inputType: InputType.Select,
            inputProps: {
                options: authCustomClaims.map(({name, label}) => ({label, value: name})),
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
}


const ClaimsList = (props: IProps) => {

    const claims = authCustomClaims.map(it => it.name)
    const editable = props.data.filter(it => claims.indexOf(it.claimType) >= 0)
    const [data, setData] = useState<IUserClaim []>(editable)
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
                onEdit={handleEdit}
            />
            <EditDialog open={dialog} onClose={handleClose} title={isNew ? "New claim" : "Edit claim"}>
                <ClaimEditorForm
                    initialValues={isNew ? {userId: props.user.id} : selected}
                    isNew={isNew}
                    onNew={handleAdded}
                    onEdited={handleEdited}
                    done={handleClose}
                    list={data}
                />
            </EditDialog>
        </div>
    );
}

export default ClaimsList;
