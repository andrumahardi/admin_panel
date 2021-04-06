import { Action, createReducer, on } from "@ngrx/store";
import { UserReducerPayload, UserStates } from "../models/users";
import * as UserActions from "../actions/user.actions"


const initialState: UserStates = {
    currentUser: {},
    userMenus: []
}

const stateReducer = createReducer(
    initialState,
    on(UserActions.setUser, (state: UserStates = initialState, { payload }: UserReducerPayload): UserStates => {
        return {
            ...state,
            currentUser: payload
        }
    }),
    on(UserActions.setUserMenu, (state: UserStates = initialState, { payload }: UserReducerPayload): UserStates => {
        return {
            ...state,
            userMenus: payload
        }
    })
)

export function userReducer(state: UserStates | undefined, action: Action) {
    return stateReducer(state, action)
}