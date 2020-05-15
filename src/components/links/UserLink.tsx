import React from 'react';
import {linkColor} from "../../theme/custom-colors";
import {localRoutes} from "../../data/constants";
import {Link} from "react-router-dom";

interface IProps {
    id: string
    name: string
    title?: string
}

const UserLink = ({id, name, title}: IProps) => (
    <Link title={title} style={{textDecoration: 'none' ,color:linkColor}} to={`${localRoutes.users}/${id}`}>{name}</Link>
);

export default UserLink
