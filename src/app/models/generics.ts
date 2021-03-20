export interface PaginatedListResult {
    results: Array<{[key: string]: any}>,
    total_pages: number
}

export interface Generics {
    [key: string]: any
}

export interface DropdownItemActionTypes {
    SET_TENANT_LIST: string,
    SET_ROLE_LIST: string,
    SET_MENU_LIST: string
}

export interface ArrayOfObjects {
    [key: string]: Array<Generics>
}