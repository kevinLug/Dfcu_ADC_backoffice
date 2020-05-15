import React from 'react';
import {Link} from "react-router-dom";
import {localRoutes} from "../../data/constants";
import {useTheme} from "@material-ui/core";
import {linkColor} from "../../theme/custom-colors";

interface IProps {
    id: string
    name: string
}

const ContactLink = ({id, name}: IProps) => {
    return (
        <Link style={{textDecoration: 'none' ,color:linkColor}} to={`${localRoutes.contacts}/${id}`}>{name}</Link>
    );
};

export default ContactLink
