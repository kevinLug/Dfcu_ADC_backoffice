import React from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";
import {Box} from "@material-ui/core";

interface IProps {
    message?:string;
}

const Loading = ({message = "Loading..."}:IProps) => {
    return (
        <Box width='100%' display='flex' alignContent='center' justifyContent='center' pt={3}>
            {message}
            <CircularProgress/>
        </Box>
    );
}
export default Loading;
