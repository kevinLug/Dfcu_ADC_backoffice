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
import {IWorkflowFilter, WorkflowStatus, WorkflowSubStatus} from "./types";
import {printDate} from "../../utils/dateHelpers";
import {workflowTypes} from "./config";

interface IProps {
    onFilter: (data: any) => any
    loading: boolean
}

const Filter = ({onFilter, loading}: IProps) => {
    const [data, setData] = useState<IWorkflowFilter>({
        from: null,
        to: null,
        statuses: [],
        subStatuses: [],
        workflowTypes: [],
        applicant: '',
        assignee: '',
        userId: ''
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
        if (name === 'from' || name === 'to') {
            value = value ? value.toISOString() : value
        }
        console.log("Value Change", {name, value})
        const newData = {...data, [name]: value}
        setData({...newData})
        submitForm(newData)
    }

    return <form>
        <Grid spacing={3} container>
            <Grid item xs={12}>
                <PDateInput
                    name="from"
                    value={data['from'] || null}
                    onChange={handleValueChange('from')}
                    label="From"
                    variant="inline"
                    inputVariant='outlined'
                />
            </Grid>
            <Grid item xs={12}>
                <PDateInput
                    name="to"
                    value={data['to'] || null}
                    onChange={handleValueChange('to')}
                    label="To"
                    variant="inline"
                    inputVariant='outlined'
                />
            </Grid>
            <Grid item xs={12}>
                <PSelectInput
                    name="statuses"
                    value={data['statuses']}
                    onChange={handleChange}
                    multiple
                    label="Status"
                    variant="outlined"
                    size='small'
                    options={toOptions(enumToArray(WorkflowStatus))}
                />
            </Grid>
            <Grid item xs={12}>
                <PSelectInput
                    name="subStatuses"
                    value={data['subStatuses']}
                    onChange={handleChange}
                    multiple
                    label="Sub Status"
                    variant="outlined"
                    size='small'
                    options={toOptions(enumToArray(WorkflowSubStatus))}
                />
            </Grid>

            <Grid item xs={12}>
                <PSelectInput
                    name="workflowTypes"
                    value={data['workflowTypes']}
                    onChange={handleChange}
                    multiple
                    label="Account Type"
                    variant="outlined"
                    size='small'
                    options={toOptions(workflowTypes)}
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
                    name="userId"
                    value={data['userId']}
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
