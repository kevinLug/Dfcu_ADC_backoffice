import * as React from "react";
import {useState} from "react";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {toOptions} from "../../../components/inputs/inputHelpers";
import {Box} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import PSelectInput from "../../../components/plain-inputs/PSelectInput";
import {enumToArray} from "../../../utils/stringHelpers";
import {Gender} from "../types";

interface IProps {
    onFilter: (data: any) => any
    loading: boolean
}

const Filter = ({onFilter, loading}: IProps) => {
    const [data, setData] = useState({
        name: '',
        gender: '',
        email: '',
        phone: '',
        nin: ''
    })

    function submitForm(values: any) {
        onFilter(values)
    }

    function handleChange(event: React.ChangeEvent<any>) {
        const name = event.target.name
        const value = event.target.value
        console.log({name,value})
        const newData = {...data, [name]: value}
        setData({...newData})
        submitForm(newData)
    }

    return <form>
        <Grid spacing={3} container>
            <Grid item xs={12}>
                <TextField
                    name="name"
                    value={data['name']}
                    onChange={handleChange}
                    label="Name"
                    variant="outlined"
                    fullWidth
                    size='small'
                />
            </Grid>
            <Grid item xs={12}>
                <PSelectInput
                    name="gender"
                    value={data['gender']}
                    onChange={handleChange}
                    label="Gender"
                    variant="outlined"
                    size='small'
                    options={toOptions(enumToArray(Gender))}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    name="email"
                    value={data['email']}
                    onChange={handleChange}
                    label="Email"
                    type="email"
                    variant='outlined'
                    size='small'
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    name="phone"
                    value={data['phone']}
                    onChange={handleChange}
                    label="Phone"
                    type="text"
                    variant='outlined'
                    size='small'
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    name="nin"
                    value={data['nin']}
                    onChange={handleChange}
                    label="NIN"
                    type="text"
                    variant='outlined'
                    size='small'
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <Box display="flex" flexDirection="row-reverse" >
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
