import * as faker from 'faker';
import {getRandomStr} from "../../utils/stringHelpers";
import {hasValue} from "../../components/inputs/inputHelpers";

const uuid = require('uuid/v4');

export interface IPerson {
    salutation: string,
    firstName: string
    lastName: string
    middleName: string
    gender: string
    civilStatus: string
    dateOfBirth: Date
}

export interface IEmail {
    id?: string
    value: string
    category: string
    isPrimary: boolean
}

export enum IdentificationCategory {
    Nin = 'Nin',
    Tin = 'Tin',
    Passport = 'Passport',
    DrivingPermit = 'DrivingPermit',
    VillageCard = 'VillageCard',
    Nssf = 'Nssf',
    Other = 'Other'
}

export enum CivilStatus {
    Other = 'Other',
    Single = 'Single',
    Married = 'Married',
    Divorced = 'Divorced'
}

export enum Gender {
    Male = 'Male',
    Female = 'Female',
}

export enum PhoneCategory {
    Mobile = "Mobile",
    Office = "Office",
    Home = "Home",
    Fax = "Fax",
    Other = "Other"
}

export enum EmailCategory {
    Work = 'Work',
    Personal = 'Personal',
    Other = 'Other',
}

export enum ContactCategory {
    Person = 'Person',
    Company = 'Company'
}

export enum CompanyCategory {
    Limited = 'Limited',
    Ngo = 'Ngo',
    Other = 'Other'
}


export enum RelationshipCategory {
    Mother = 'Mother',
    Father = 'Father',
    Daughter = 'Daughter',
    Son = 'Son',
    Fiancee = 'Fiancee',
    Sister = 'Sister',
    Brother = 'Brother',
    Other = 'Other',
}

export interface IPhone {
    id: string
    value: string
    category: string
    isPrimary: boolean
}

export interface IContactTag {
    id: string
    value: string
}

export interface IContactUrl {
    id: string
    category: string
    value: string
}

export interface IBankAccount {
    id: string
    bank: string
    branch: string
    name: string
    number: string
}

export interface IIdentification {
    id?: string
    value: string
    cardNumber?: string
    issuingCountry: string
    issueDate: Date
    expiryDate: Date
    category: string
    isPrimary: boolean
}

export interface IContactEvent {
    id: string
    value: string
    category: string
}

export interface IAddress {
    id?: string
    category: string
    isPrimary: boolean
    country: string
    district: string
    county: string
    subCounty?: string
    village?: string
    parish?: string
    postalCode?: string
    street?: string

    freeForm?: string
    latLon?: string
    placeId?: string
}

export interface ICompany {
    category: CompanyCategory
    name: string
    dateOfPayment: Date
    numberOfEmployees: number
}

export interface IFinancialData {
    monthlyNetSalary: number
    monthlyGrossSalary: number
    dateOfEmployment: Date
}

export interface IContact {
    id: string
    category: ContactCategory
    person: IPerson
    emails: IEmail[]
    phones: IPhone[]
    events: IContactEvent[]
    addresses: IAddress[]
    identifications: IIdentification[]
    company: ICompany
    tags: IContactTag[]
    urls: IContactUrl[]
    bankAccounts: IBankAccount[]
    financialData: IFinancialData
}

export interface IContactQuery {
    name?: string
    limit?: number
    skip?: number
}


enum TeamRole {
    Leader = "Leader",
    Member = "Member"
}

export interface ITeamMember {
    id?: string
    name: string
    details: string
    role: TeamRole
}

export interface IContactsFilter {
    query?: string
    skip?: number
    limit?: number
}

export const fakeTeam = (): ITeamMember => {
    return {
        id: uuid(),
        name: faker.company.companyName(),
        details: faker.company.catchPhrase(),
        role: TeamRole.Member
    }
}

export const fakeContact = (): IContact | null => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    return {
        bankAccounts: [],
        financialData: {
            dateOfEmployment: new Date(),
            monthlyGrossSalary: 1200000,
            monthlyNetSalary:565656
        },
        tags: [],
        urls: [],
        id: uuid(),
        category: ContactCategory.Person,
        person: {
            firstName: firstName,
            middleName: faker.name.lastName(),
            lastName: lastName,
            civilStatus: 'Single',
            salutation: 'Mr',
            dateOfBirth: faker.date.past(),
            gender: Gender.Male
        },
        phones: [
            {
                id: uuid(),
                category: PhoneCategory.Mobile,
                isPrimary: false,
                value: faker.phone.phoneNumber('077#######')
            },
            {
                id: uuid(),
                category: PhoneCategory.Mobile,
                isPrimary: false,
                value: faker.phone.phoneNumber('031#######')
            }
        ],

        emails: [
            {
                id: uuid(),
                category: EmailCategory.Work,
                isPrimary: false,
                value: faker.internet.email(firstName, lastName)
            }
        ],
        addresses: [
            {
                id: uuid(),
                category: 'Home',
                isPrimary: false,
                country: faker.address.country(),
                district: faker.address.city(),
                county: faker.address.city(),
                freeForm: faker.address.streetName()
            }
        ],
        identifications: [
            {
                id: uuid(),
                category: IdentificationCategory.Nin,
                value: getRandomStr(),
                cardNumber: getRandomStr(5),
                issueDate: faker.date.past(),
                expiryDate: faker.date.future(),
                issuingCountry: 'Uganda',
                isPrimary: true,
            }
        ],
        events: [],
        company:{
            name:'',
            category:CompanyCategory.Limited,
            numberOfEmployees:45,
            dateOfPayment: new Date()
        }
    };
};


export const renderName = (contact: IContact, salutation?: boolean): string => {
    if (contact.category === ContactCategory.Person) {
        const person = contact.person
        const name: string =
            salutation ?
                `${person.salutation || ''} ${person.firstName || ''} ${person.middleName || ''} ${person.lastName || ''}`
                : `${person.firstName || ''} ${person.middleName || ''} ${person.lastName || ''}`;

        return name.trim().replace(/\s+/g, ' ');
    } else {
        console.log(contact)
        return contact.company.name
    }

};


export const printAddress = (data: IAddress): string => {
    const address: string =
        `${data.street || ''} ${data.parish || ''} ${data.district || ''} ${data.country || ''}`
    return address.trim().replace(/\s+/g, ' ');
};

export const getPhone = (data: IContact): string => {
    const {phones} = data
    if (phones && phones.length > 0) {
        const pri = phones.find(it => it.isPrimary)
        if (pri)
            return pri.value
        else return phones[0].value
    }
    return "";
};

export const getPhoneObj = (data: IContact): IPhone => {
    const {phones} = data
    if (phones && phones.length > 0) {
        const pri = phones.find(it => it.isPrimary)
        if (pri)
            return pri
        else return phones[0]
    }
    return {} as IPhone;
};

export const getEmail = (data: IContact): string => {
    const {emails} = data
    if (emails && emails.length > 0) {
        const pri = emails.find(it => it.isPrimary)
        if (pri)
            return pri.value
        else return emails[0].value
    }
    return "";
};

export const getEmailObj = (data: IContact): IEmail => {
    const {emails} = data
    if (emails && emails.length > 0) {
        const pri = emails.find(it => it.isPrimary)
        if (pri)
            return pri
        else return emails[0]
    }
    return {} as IEmail;
};

export const getNinObj = (data: IContact): IIdentification => {
    const {identifications} = data
    if (identifications && identifications.length > 0) {
        const pri = identifications.find(it => it.isPrimary)
        if (pri)
            return pri
        else return identifications[0]
    }
    return {} as IIdentification;
};
export const getNin = (data: IContact): string => {
    const {identifications} = data
    if (identifications && identifications.length > 0) {
        const pri = identifications.find(it => it.isPrimary)
        if (pri)
            return pri.value
        else return identifications[0].value
    }
    return "";
};

export const getAddress = (data: IContact): IAddress | {} => {
    const {addresses} = data
    if (addresses && addresses.length > 1) {
        const pri = addresses.find(it => it.isPrimary)
        if (pri)
            return pri
        else return addresses[0]
    }
    return {};
};

export function toTitleCase(str:string) {
    if(!hasValue(str))
        return str
    const splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}

