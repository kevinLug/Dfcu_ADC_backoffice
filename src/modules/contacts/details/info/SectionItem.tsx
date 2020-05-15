import React, {useState} from 'react';
import Box from "@material-ui/core/Box";

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
        <Box display="flex" p={1}
             onMouseEnter={handleEntered}
             onMouseLeave={handleLeave}
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


export default SectionItem;
