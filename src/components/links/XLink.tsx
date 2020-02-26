import React from 'react';
import {linkColor} from "../../theme/custom-colors";

interface IProps {
    name: string
    title?: string
}

const XLink = ({name, title}: IProps) => (
    <a style={{textDecoration: 'none', color: linkColor, cursor:'pointer'}} onClick={(e)=>e.preventDefault()} title={title} >{name}</a>
);

export default XLink
