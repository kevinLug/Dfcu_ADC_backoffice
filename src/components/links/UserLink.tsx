import React from 'react';
import {Link} from "react-router-dom";
import {localRoutes} from "../../data/constants";
import {linkColor} from "../../theme/custom-colors";

interface IProps {
    id: string
    name: string
    title?: string
}

const UserLink = ({id, name, title}: IProps) => (
    <a style={{textDecoration: 'none', color: linkColor}} title={title}>{name}</a>
);

export default UserLink
