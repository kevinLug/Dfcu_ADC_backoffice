import React from 'react';
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import GridWrapper from "./GridWrapper";
import {Box} from "@material-ui/core";

const Loading = () => {
    return (
        <Box width='100%' display='flex' alignContent='center' justifyContent='center' pt={15}>
            <CircularProgress/>
        </Box>
    );
}
export default Loading;
