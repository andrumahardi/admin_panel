import { HttpErrorResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { ArraysInObject, Generics, PaginatedListResult } from "../models/generics"
import { Menu } from "../models/menus"
import { ConfigService } from "./config.service"
import * as UserActions from "../actions/user.actions"

@Injectable({
    providedIn: "root"
})
export class MenuService extends ConfigService {
    private readonly baseEndpoint: string = `${this.getUrl("menus")}/`

    getList(params: string = ""): Promise<PaginatedListResult> {
        if (params) params = `?${params}`
        const url = `${this.baseEndpoint}${params}`

        return new Promise<PaginatedListResult>((resolve, reject) => {
            this.http.get(url, { observe: "response", headers: { 
                authorization: `Token ${this.getAccessToken()}`
            }})
                .subscribe((data: Generics): void => {
                    const { body } = data
                    resolve(body)
                }, (error: HttpErrorResponse): void => reject(error))
        })
    }

    getAll(): Promise<Array<Generics>> {
        const url = `${this.baseEndpoint}get_all`

        return new Promise<Array<Generics>>((resolve, reject) => {
            this.http.get(url, { observe: "response", headers: {
                authorization: `Token ${this.getAccessToken()}`
            }})
                .subscribe((data: Generics) => {
                    resolve(data.body.results)
                },
                (error: HttpErrorResponse) => reject(error))
        })
    }

    doDestroy(id: number): Promise<boolean> {
        const url = `${this.baseEndpoint}${id}/`

        return new Promise((resolve, reject) => {
            this.http.delete(url, { 
                observe: "response", 
                headers: { authorization: `Token ${this.getAccessToken()}` } 
            })
                .subscribe((): void => resolve(true),
                (error: HttpErrorResponse): void => reject(error))
        })
    }

    organizeMenu(menulist: Array<Generics>): Array<Menu> {
        return menulist
            .map((obj: Generics) => {
                let output: Menu = {
                    id: obj.id,
                    menu_name: obj.menu_name,
                    menu_icon_url: obj.menu_icon_url,
                    menu_path_url: obj.menu_path_url,
                    parent: obj.parent,
                    children: []
                }
                menulist.forEach((child: Generics) => {
                    if (obj.id === child.parent) {
                        output["children"].push({
                            id: child.id,
                            menu_name: child.menu_name,
                            menu_icon_url: child.menu_icon_url,
                            menu_path_url: child.menu_path_url,
                            parent: child.parent,
                            children: []
                        })
                    }
                })
                return output
            })
            .filter((obj: Generics) => !obj.parent)
    }

    setUserMenu(menulist: Array<Generics>): void {
        const menu: Array<Menu> = this.organizeMenu(menulist)
        this.store.dispatch(UserActions.setUserMenu({ payload: menu }))
    }
}