import { Action, createReducer, on } from "@ngrx/store";
import * as DropdownListActions from "../actions/dropdown_items.actions"
import { ArrayOfObjects } from "../models/generics";


const initialState: ArrayOfObjects = {
    tenantList: [],
    roleList: []
}

const stateReducer = createReducer(
    initialState,
    on(DropdownListActions.setRoleList, (state: ArrayOfObjects = initialState, { payload }: ArrayOfObjects): ArrayOfObjects => {
        return {
            ...state,
            roleList: payload
        }
    }),
    on(DropdownListActions.setTenantList, (state: ArrayOfObjects = initialState, { payload }: ArrayOfObjects): ArrayOfObjects => {
        return {
            ...state,
            tenantList: payload
        }
    })
)

export function dropdownItemsReducer(state: ArrayOfObjects | undefined, action: Action) {
    return stateReducer(state, action)
}