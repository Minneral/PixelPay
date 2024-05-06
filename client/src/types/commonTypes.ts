import { NavigationTree } from "./apiTypes"

export type NotificationPropsType = {
    "message": string,
}

export type DropdownPropsType = {
    data: NavigationTree[]
}

export type ButtonPropsType = {
    title: string,
    callBack: () => void,
    fz: number,
    fw: number,
    stretch: boolean,
    color? : string,
    disabled? : boolean
}

export type CardPropsType = {
    id: number,
    name: string,
    price: string,
    url: string
}

export type GameStripPropsType = {
    game: string,
    iconUrl: string,
}