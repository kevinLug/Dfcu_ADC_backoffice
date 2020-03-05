import React from 'react';
import {Typography} from "@material-ui/core";

interface IProps {
    name: any
}

const TestComponent = ({name}: IProps) => {
    return (
        <div>
            <Typography variant='body2'>Hello {name}</Typography>
        </div>
    );
}
export default TestComponent;
