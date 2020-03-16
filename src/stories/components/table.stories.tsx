import React from "react";
import * as faker from "faker";
import XTable from "../../components/table/XTable";
import Typography from "@material-ui/core/Typography";
import {XHeadCell} from "../../components/table/XTableHead";
import {Chip} from "@material-ui/core";
import DoneIcon from '@material-ui/icons/Done';


export default {
    title: 'Table',
    component: XTable,
};


export const SimpleTable = () => {

    const createPerson = () => {
        return {
            id: faker.random.alphaNumeric(12),
            name: faker.name.firstName(),
            age: faker.random.number({min: 20, max: 50}),
            gender: faker.random.arrayElement(['Male', 'Female'])
        }
    }
    const cells: XHeadCell[] = [
        {
            name: "name",
            label: "Person Name"
        },
        {
            name: "age",
            label: "Age"
        },
        {
            name: "gender",
            label: "Gender",
            render: (value, rec) => {
                return <div style={{
                    backgroundColor: value === 'Male' ? 'blue' : 'pink'
                }}>
                    <Chip
                        label={value}
                        deleteIcon={<DoneIcon/>}
                    />
                </div>
            }
        }
    ]
    const data: any[] = [
        createPerson(),
        createPerson(),
        createPerson(),
        createPerson(),
    ]
    
    return <div>
        <Typography>Our table</Typography>
        <XTable headCells={cells} data={data}/>
    </div>
}
