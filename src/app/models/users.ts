import { Menu } from "./menus";

export interface User {
    id: number,
    username: string,
    is_active: boolean,
    email: string,
    first_name: string,
    last_name: string,
    mobile: string
}

export interface PreLoginPayload {
    username: string,
    password: string
}

export interface UserActionTypes {
    SET_CURRENT_USER: string,
    SET_USER_MENU: string
}

export interface UserActionPayload {
    payload: User | any
}

export interface UserReducerPayload {
    payload: User | any,
    type: string
}

export interface UserStates {
    currentUser: User | {[key: string]: any},
    userMenus: Array<Menu>
}
