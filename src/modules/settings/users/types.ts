import * as faker from "faker"

import {ICsvColumn} from "../../../utils/stringHelpers";
import {authCustomClaims} from "../customClaims/config";

export interface IUserView {
    id: string,
    fullname: null,
    roles: string[],
    preferredUsername: string,
    password: string,
    telephone: string,
    claims: any
    claimsList: IUserClaim[]
}

export interface IUserClaim {
    id: number
    userId: string
    claimType: string
    claimValue: string
}


const fakeClaim = () => {
    const sample: any = {
        email: faker.internet.email()
    }
    authCustomClaims.forEach(it => {
        sample[it.name] = faker.lorem.word()
    })
    return sample
}

export const createFakeClaims = (count = 3) => {
    const toReturn: any[] = []
    for (let x = 0; x < count; x++) {
        toReturn.push(fakeClaim())
    }
    return toReturn;
}

export const createCsvColumns = (): ICsvColumn[] => {
    const toReturn: ICsvColumn[] = [
        {
            dataKey: "email", title: 'email'
        }
    ]
    authCustomClaims.forEach(({name, label}) => {
        toReturn.push({
            dataKey: name, title: name
        })
    })
    return toReturn;
}



