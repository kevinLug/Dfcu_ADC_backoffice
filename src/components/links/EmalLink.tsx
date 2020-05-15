import React from 'react';
import {linkColor} from "../../theme/custom-colors";

interface IProps {
    value:string
}
const EmailLink = ({value}:IProps) => (
    <a style={{textDecoration: 'none' ,color:linkColor, cursor:'pointer'}} href={`mailto:${value}`}>{value}</a>
);

export default EmailLink
