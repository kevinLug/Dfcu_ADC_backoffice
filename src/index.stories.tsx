import React from "react";
import {Form, Formik} from 'formik';
import {storiesOf} from "@storybook/react";
import XDateInput from "./components/inputs/XDateInput";
import {Button} from "@material-ui/core";

interface IProps {

}

storiesOf("Button", module)
    .add(
        "contained",
        () => (
            <Button variant='contained'> contained</Button>
        ),
        {info: {inline: true}}
    )
    .add(
        "outlined",
        () => (
            <Button variant='outlined'> outlined</Button>
        ),
        {info: {inline: true}}
    );
