import React from 'react';
import {Box} from "@material-ui/core";
import DataValue from "./DataValue";

interface IProps {
    icon: any
    label: any
}

const IconLabel = (props: IProps) => {
    return (
        <Box display='flex'>
            <Box style={{paddingTop: 2}}>
                <DataValue>
                    {props.icon}&nbsp;
                </DataValue>
            </Box>
            <Box flexGrow={1}>
                <DataValue>
                    {props.label}
                </DataValue>
            </Box>
        </Box>
    );
}


export default IconLabel;
