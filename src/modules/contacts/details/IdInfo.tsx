import React from 'react';
import {getNinObj, IContact, renderName} from "../types";
import IBox from "../../../components/ibox/IBox";
import DetailView, {IRec} from "../../../components/DetailView";
import {printDate} from "../../../utils/dateHelpers";
import PersonIcon from '@material-ui/icons/Person';

interface IProps {
    data: IContact
}

const IdInfo = ({data}: IProps) => {
    const {person} = data
    const idData = getNinObj(data)
    const displayData: IRec[] = [
        {
            label: 'Name',
            value: renderName(person)
        },
        {
            label: 'BirthDay',
            value: printDate(person.dateOfBirth)
        },
        {
            label: 'Gender',
            value: person.gender
        },
        {
            label: 'Marital Status',
            value: person.civilStatus
        },
        {
            label: 'NIN',
            value: idData.value
        },
        {
            label: 'Card Number',
            value: idData.cardNumber
        },
        {
            label: 'Country',
            value: idData.issuingCountry
        },
        {
            label: 'Date of Issue',
            value: printDate(idData.startDate)
        },
        {
            label: 'Date of Expiry',
            value: printDate(idData.expiryDate)
        }
    ]
    const title = <div style={{display: 'flex', flexDirection: 'row'}}>
        <PersonIcon fontSize='small'/><span>&nbsp;Identification</span>
    </div>
    return (

        <IBox title={title}>
            <DetailView data={displayData}/>
        </IBox>
    );
}


export default IdInfo;
