import { Action, createReducer, on } from "@ngrx/store";
import * as DropdownListActions from "../actions/dropdown_items.actions"
import { ArraysInObject } from "../models/generics";


const initialState: ArraysInObject = {
    tenantList: [],
    roleList: [],
    menuList: []
}

const stateReducer = createReducer(
    initialState,
    on(DropdownListActions.setRoleList, (state: ArraysInObject = initialState, { payload }: ArraysInObject): ArraysInObject => {
        return {
            ...state,
            roleList: payload
        }
    }),
    on(DropdownListActions.setTenantList, (state: ArraysInObject = initialState, { payload }: ArraysInObject): ArraysInObject => {
        return {
            ...state,
            tenantList: payload
        }
    }),
    on(DropdownListActions.setMenuList, (state: ArraysInObject = initialState, { payload }: ArraysInObject): ArraysInObject => {
        return {
            ...state,
            menuList: payload
        }
    })
)

export function dropdownItemsReducer(state: ArraysInObject | undefined, action: Action) {
    return stateReducer(state, action)
}