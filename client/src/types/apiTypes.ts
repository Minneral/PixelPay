export type LoginFormDataType = {
    "name": string,
    "password": string,
}

export type RegisterFormDataType = {
    "name": string,
    "password": string,
    "email": string
}

export type ChangePasswordFormDataType = {
    "oldPass": string,
    "newPass": string,
    "newConf": string,
}

export type UserType = {
    "name": string,
    "email": string,
    "password": string,
    "balance": string,
    "user_token": string,
    "token_expiration": string,
    "salt": string,
    "tradelink": string,
    "avatar": string,
}

export type ApiResponseType = {
    "status": string,
    "message": string,
    "data": any
}

export type NavigationType = {
    id: number,
    name: string,
    parent_id: number,
    game: "string"
}

export type NavigationTree = {
    id: number,
    name: string,
    parent_id: number,
    game: "string",
    children?: NavigationTree[],
}

export type GameType = {
    id: number,
    game: string,
}

export type ListingType = {
    id: number,
    game: string,
    item: string,
    seller: string,
    price: string,
    url: string,
}

export type CartType = {
    id: number,
    game: string,
    item: string,
    price: string,
    url: string,
}

export type CartDeleteDataType = {
    listing_id: string,
}

export type PurchaseType = {
    id: number,
    item: string,
    customer: string,
    price: string,
    date: string,
    url: string,
}

export type TransactionType = {
    id: number,
    user: string,
    type: string,
    value: string,
    date: string
}

export type CategoriesType = {
    id: number,
    category: string,
    game: string,
}

export type FiltersType = {
    id: number,
    filter_name: string,
    category: string,
    game: string,
}

export type ListingFilterType = {
    id: number,
    listing_id: number,
    filter_id: number,
}