import React from 'react';
import {Link} from "react-router-dom";
import {localRoutes} from "../data/constants";

interface IProps {
    id: string
    name: string
    title?: string
}

const ContactLink = ({id, name,title}: IProps) => (
    <Link title={title} style={{textDecoration:'none'}} to={`${localRoutes.contacts}/${id}`}>{name}</Link>
);

export default ContactLink
