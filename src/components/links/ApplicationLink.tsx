import React from 'react';
import {Link} from "react-router-dom";
import {localRoutes} from "../../data/constants";
import {linkColor} from "../../theme/custom-colors";

interface IProps {
    id: string
    name: string
}

const ApplicationLink = ({id, name}: IProps) => (
    <Link style={{textDecoration: 'none', color: linkColor}} to={`${localRoutes.applications}/${id}`}>{name}</Link>
);

export default ApplicationLink
