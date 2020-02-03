import React, {useState} from 'react';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import {Grid} from "@material-ui/core";

interface IProps {
    children?: any
    buttons?: any
}

const SectionItem = ({children, buttons}: IProps) => {
    const [canEdit, setCanEdit] = useState<boolean>(false)
    const handleEntered = () => {
        setCanEdit(true)
    }
    const handleLeave = () => {
        setCanEdit(false)
    }
    return (
        <Box display="flex"
             onMouseEnter={handleEntered}
             onMouseLeave={handleLeave}
             className='has-edit-icon'
        >
            {children}
            {buttons &&
            <Box>
                {canEdit && buttons}
            </Box>
            }
        </Box>
    );
}

export const SectionItemGrid = ({children, buttons}: IProps) => {
    const [canEdit, setCanEdit] = useState<boolean>(false)
    const handleEntered = () => {
        setCanEdit(true)
    }
    const handleLeave = () => {
        setCanEdit(false)
    }
    return (
        <Grid container onMouseEnter={handleEntered}
              onMouseLeave={handleLeave}
              className='has-edit-icon'>
            <Grid item xs={10} >
                {children}
            </Grid>
            <Grid item xs={2} >
                { (buttons&&canEdit) && buttons}
            </Grid>
        </Grid>
    );
}

interface IContentProps {
    value:any
    category:string
}
export const SectionItemContent = ({value, category}: IContentProps) => {

    return (
        <Box pb={1}>
            <Typography variant='body1' noWrap display='inline'>{value}</Typography>
            <Typography variant='caption' display='inline'>&nbsp;({category}) &nbsp;&nbsp;</Typography>
        </Box>
    );
}


export default SectionItem;
