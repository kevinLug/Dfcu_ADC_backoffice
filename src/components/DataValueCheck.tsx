import React from 'react';
import {Typography} from "@material-ui/core";


const DataValueValidationCheck = ({children,...props}: any) => {
    return (
        <Typography variant='body1' component='div' {...props} >
            {children}
        </Typography>
    );
}
