import * as faker from "faker"
import {authEditableClaims} from "./details/ClaimsList";
import {ICsvColumn} from "../../../utils/stringHelpers";
import Toast from "../../../utils/Toast";
import {hasValue} from "../../../components/inputs/inputHelpers";

export interface IUserView {
    id: string,
    fullname: null,
    roles: string[],
    preferredUsername: string,
    password: string,
    telephone: string,
    claims: any
    claimsList: any[]
}


const fakeClaim = () => {
    const sample: any = {
        email: faker.internet.email()
    }
    authEditableClaims.forEach(it => {
        sample[it] = faker.lorem.word()
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
    authEditableClaims.forEach(it => {
        toReturn.push({
            dataKey: it, title: it
        })
    })
    return toReturn;
}



