import React from 'react';

interface IProps {
    id: string
    name: string
    title?: string
}

const UserLink = ({id, name,title}: IProps) => (
    <a title={title} style={{textDecoration:'none'}} href={`#/${id}`} onClick={(e)=>e.preventDefault()}>{name}</a>
);

export default UserLink
