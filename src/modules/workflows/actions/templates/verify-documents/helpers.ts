import {AccountCategory, GatewayDocument} from "../../../../../data/types";
import {hasNoValue} from "../../../../../components/inputs/inputHelpers";

export const getGatewayDocsList = (category: string, product: string, accountCategories: AccountCategory[]): GatewayDocument[] => {
    const categoryArr = accountCategories.filter(it => it.code.toLocaleLowerCase() === category.toLocaleLowerCase())
    if (hasNoValue(categoryArr) || hasNoValue(categoryArr[0])) {
        return []
    }
    const categoryObj = categoryArr[0]

    const accountArr = categoryObj.accounts.filter(it => it.code.toLocaleLowerCase() === product.toLocaleLowerCase())
    if (hasNoValue(accountArr) || hasNoValue(accountArr[0])) {
        return []
    }
    const account = accountArr[0]
    return account.documents
}
