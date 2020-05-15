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
        <Box display="flex" px={1} py={1}
             onMouseEnter={handleEntered}
             onMouseLeave={handleLeave}
            className='has-hidden-icon'
        >
            <Box display='flex' flexGrow={1} pt={1}>
                <Box >
                    <Typography variant='body1'>{icon}</Typography>
                </Box>
                <Box >
                    <Typography variant='body2'>&nbsp;<b>{title}</b></Typography>
                </Box>
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
