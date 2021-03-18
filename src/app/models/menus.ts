export interface Menu {
    id: number,
    menu_icon_url: string,
    menu_path_url: string,
    menu_name: string,
    parent: number,
    children: Array<Menu>
}