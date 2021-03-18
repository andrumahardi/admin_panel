import { createAction} from "@ngrx/store"
import { ArrayOfObjects, DropdownItemActionTypes } from "../models/generics"

const types: DropdownItemActionTypes = {
    SET_TENANT_LIST: "[DROPDOWN ITEMS] SET_TENANT_LIST",
    SET_ROLE_LIST: "[DROPDOWN ITEMS] SET_ROLE_LIST"
}

export const setTenantList = createAction(
    types.SET_TENANT_LIST, (payload: ArrayOfObjects) => payload)

export const setRoleList = createAction(
    types.SET_ROLE_LIST, (payload: ArrayOfObjects) => payload)