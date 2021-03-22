import { createAction} from "@ngrx/store"
import { ArraysInObject, DropdownItemActionTypes } from "../models/generics"

const types: DropdownItemActionTypes = {
    SET_TENANT_LIST: "[DROPDOWN ITEMS] SET_TENANT_LIST",
    SET_ROLE_LIST: "[DROPDOWN ITEMS] SET_ROLE_LIST",
    SET_MENU_LIST: "[DROPDOWN ITEMS] SET_MENU_LIST",
    SET_PROVINCE_LIST: "[DROPDOWN ITEMS] SET_PROVINCE_LIST",
    SET_CITY_LIST: "[DROPDOWN ITEMS] SET_CITY_LIST",
}

export const setTenantList = createAction(
    types.SET_TENANT_LIST, (payload: ArraysInObject) => payload)

export const setRoleList = createAction(
    types.SET_ROLE_LIST, (payload: ArraysInObject) => payload)

export const setMenuList = createAction(
    types.SET_MENU_LIST, (payload: ArraysInObject) => payload)

export const setProvinceList = createAction(
    types.SET_PROVINCE_LIST, (payload: ArraysInObject) => payload)

export const setCityList = createAction(
    types.SET_CITY_LIST, (payload: ArraysInObject) => payload)