import React from 'react';
import {linkColor} from "../../theme/custom-colors";

interface IProps {
    value:string
}
const PhoneLink = ({value}:IProps) => (
    <a style={{textDecoration: 'none', color: linkColor, cursor:'pointer'}} href={`tel:${value}`}>{value}</a>
);

export default PhoneLink
