import * as React from "react";
import {useState} from "react";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {toOptions} from "../../components/inputs/inputHelpers";
import {Box} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import PSelectInput from "../../components/plain-inputs/PSelectInput";
import PDateInput from "../../components/plain-inputs/PDateInput";
import {enumToArray} from "../../utils/stringHelpers";
import {WorkflowStatus} from "./types";

interface IProps {
    onFilter: (data: any) => any
    loading: boolean
}

const Filter = ({onFilter, loading}: IProps) => {
    const [data, setData] = useState({

        from: null,
        to: null,
        status: '',
        subStatus: '',
        type: '',
        applicant: '',
        assignee: '',
        user: ''
    })

    function submitForm(values: any) {
        onFilter(values)
    }

    function handleChange(event: React.ChangeEvent<any>) {
        const name = event.target.name
        const value = event.target.value
        const newData = {...data, [name]: value}
        setData({...newData})
        submitForm(newData)
    }

    const handleValueChange = (name: string) => (value: any) => {
        const newData = {...data, [name]: value}
        setData({...newData})
        submitForm(newData)
    }

    return <form>
        <Grid spacing={3} container>
            <Grid item xs={12}>
                <PDateInput
                    name="from"
                    value={data['from']}
                    onChange={handleValueChange('from')}
                    label="From"
                    variant="inline"
                    inputVariant='outlined'
                />
            </Grid>
            <Grid item xs={12}>
                <PDateInput
                    name="to"
                    value={data['to']}
                    onChange={handleValueChange('to')}
                    label="To"
                    variant="inline"
                    inputVariant='outlined'
                />
            </Grid>
            <Grid item xs={12}>
                <PSelectInput
                    name="status"
                    value={data['status']}
                    onChange={handleChange}
                    label="Status"
                    variant="outlined"
                    size='small'
                    options={toOptions(enumToArray(WorkflowStatus))}
                />
            </Grid>
            <Grid item xs={12}>
                <PSelectInput
                    name="subStatus"
                    value={data['subStatus']}
                    onChange={handleChange}
                    label="Sub Status"
                    variant="outlined"
                    size='small'
                    options={toOptions(enumToArray(WorkflowStatus))}
                />
            </Grid>

            <Grid item xs={12}>
                <PSelectInput
                    name="type"
                    value={data['type']}
                    onChange={handleChange}
                    label="Account Type"
                    variant="outlined"
                    size='small'
                    options={toOptions(['DEMBE-JOINT', 'DEMBE'])}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    name="applicant"
                    value={data['applicant']}
                    onChange={handleChange}
                    label="Applicant"
                    type="text"
                    variant='outlined'
                    size='small'
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    name="assignee"
                    value={data['assignee']}
                    onChange={handleChange}
                    label="Assignee"
                    type="text"
                    variant='outlined'
                    size='small'
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    name="user"
                    value={data['user']}
                    onChange={handleChange}
                    label="User/Agent"
                    type="text"
                    variant='outlined'
                    size='small'
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <Box display="flex" flexDirection="row-reverse">
                    <Button
                        disabled={loading}
                        variant="outlined"
                        color="primary"
                        onClick={submitForm}>Excel Export</Button>
                </Box>
            </Grid>
        </Grid>
    </form>

}

export default Filter
