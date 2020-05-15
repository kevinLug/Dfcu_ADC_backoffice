import React from "react";
import {storiesOf} from "@storybook/react";
import {Button} from "@material-ui/core";

interface IProps {

}

storiesOf("Button", module)
    .add(
        "contained",
        () => (
            <Button variant='contained'> Contained</Button>
        ),
        {info: {inline: true}}
    )
    .add(
        "outlined",
        () => (
            <Button variant='outlined'> Outlined</Button>
        ),
        {info: {inline: true}}
    ) .add(
    "text",
    () => (
        <Button variant='text'> Text</Button>
    ),
    {info: {inline: true}}
);
