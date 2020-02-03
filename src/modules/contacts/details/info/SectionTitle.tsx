import React, {useState} from 'react';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

interface IProps {
    title: string
    editButton?: any
    icon: any
}

const SectionTitle = ({title, editButton, icon}: IProps) => {
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
            <Box pt={1}>
                <Typography variant='body2'><b>{title.toUpperCase()}</b>&nbsp;&nbsp;</Typography>
            </Box>
            {editButton &&
            <Box>
                {canEdit && editButton}
            </Box>
            }
        </Box>
    );
}


export default SectionTitle;
