import React from 'react';
import ListView from "../../components/dynamic-editor/ListView";
import *as faker from "faker"
import {createArray} from "../../utils/arrayHelpers";
import {Typography} from "@material-ui/core";
import {action} from "@storybook/addon-actions";
import {IColumn, InputType} from "../../components/dynamic-editor/types";
import EditForm from "../../components/dynamic-editor/EditForm";
import {toOptions} from "../../components/inputs/inputHelpers";
import {addressCategories, genderCategories} from "../../data/comboCategories";

const uuid = require('uuid/v4');

export default {
    title: 'Dynamic Editor',
    component: ListView,
};

const fakeRecord = () => {
    return {
        id: uuid(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        age: faker.random.number({max: 100, min: 20}),
        gender: faker.random.arrayElement(["Male", "Female"]),
        about: faker.lorem.sentence(2)
    }
}
const data = createArray(5, fakeRecord)
const columns: IColumn[] = [
    {name: 'name', label: 'Name'},
    {name: 'age', label: 'Age'},
    {name: 'gender', label: 'Gender'},
    {name: 'about', label: 'About'},
]


export const SimpleList = () => <ListView data={data} columns={columns} primaryKey='id'/>;
export const ListWithTitle = () => <ListView data={data} columns={columns} primaryKey='id'
                                             title={<Typography variant='h6'>Students</Typography>}/>;
export const ListWithButtons = () => <ListView
    data={data} columns={columns}
    primaryKey='id'
    onAdd={action('clicked')}
    onDelete={action('clicked')}
    onEdit={action('clicked')}
/>;

const formColumns: IColumn[] = [
    {
        name: 'name', label: 'Name',
        inputType: InputType.Select,
        inputProps: {
            options: toOptions(addressCategories),
            variant: 'outlined'
        }
    }
    ,
    {
        name: 'age', label: 'Age',
        inputType: InputType.Text,
        inputProps: {
            type: 'number',
            variant: 'outlined'
        }
    },
    {
        name: 'word', label: 'Words',
        inputType: InputType.Text,
        inputProps: {
            type: 'text',
            variant: 'outlined'
        }
    },
    {
        name: 'gender', label: 'Gender',
        inputType: InputType.Radio,
        inputProps: {
            options: toOptions(genderCategories),
            variant: 'outlined'
        }
    },
    {
        name: 'dob', label: 'DOB',
        inputType: InputType.Date,
        inputProps: {
            inputVariant: 'outlined'
        }
    },
    {
        name: 'about', label: 'About',
        inputType: InputType.TextArea,
        inputProps: {
            variant: 'outlined'
        }
    }
]

export const DynamicForm = () => <EditForm
    columns={formColumns}
    url=''
    data={{}}
    isNew={true}
    done={() => undefined}
    onNew={() => undefined}
    onEdited={() => undefined}
    schema={undefined}
    debug
/>;
