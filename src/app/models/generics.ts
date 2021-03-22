export interface PaginatedListResult {
    results: Array<{[key: string]: any}>,
    total_pages: number
}

export interface Generics {
    [key: string]: any | Array<any>
}

export interface DropdownItemActionTypes {
    SET_TENANT_LIST: string,
    SET_ROLE_LIST: string,
    SET_MENU_LIST: string,
    SET_PROVINCE_LIST: string,
    SET_CITY_LIST: string
}

export interface ArraysInObject {
    [key: string]: Array<Generics>
}