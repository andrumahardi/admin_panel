import { createAction} from "@ngrx/store"
import { UserActionPayload, UserActionTypes } from "../models/users"

const types: UserActionTypes = {
    SET_CURRENT_USER: "[USER] SET_CURRENT_USER",
    SET_USER_MENU: "[USER] SET_USER_MENU"
}

export const setUser = createAction(
    types.SET_CURRENT_USER, (payload: UserActionPayload) => payload
)

export const setUserMenu = createAction(
    types.SET_USER_MENU, (payload: UserActionPayload) => payload
)