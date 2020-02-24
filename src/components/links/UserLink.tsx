import React from 'react';
import {linkColor} from "../../theme/custom-colors";

interface IProps {
    id: string
    name: string
    title?: string
}

const UserLink = ({id, name, title}: IProps) => (
    <a style={{textDecoration: 'none', color: linkColor, cursor:'pointer'}} title={title} onClick={(e)=>e.preventDefault()}>{name}</a>
);

export default UserLink
