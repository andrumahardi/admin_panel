import { Component } from "@angular/core"
import { Store } from "@ngrx/store"
import { CookieService } from "ngx-cookie-service"
import { AppState } from "src/app/app.states"
import { Menu } from "src/app/models/menus"
import { UserStates } from "src/app/models/users"

import { MenuService } from "src/app/service/menu.service"

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: [ "./home.component.scss" ]
})

export class HomeComponent {
    expandSidebar: boolean = true
    menus: Array<Menu> = []

    constructor(
        private store: Store<AppState>,
        private menuService: MenuService,
    ) {
        this.fetchInitialData()
    }

    fetchInitialData(): void {
        Promise.all([
            this.getPrivilegedUserMenus()
        ])
    }

    getPrivilegedUserMenus(): void {
        const promise = new Promise<UserStates>(( resolve ) => {
            this.store.select("userStates")
                .subscribe((data: UserStates): void => {
                    resolve(data)
                })
        })
        promise.then((data: UserStates) => {
                if (data.userMenus.length === 0) {    
                    const userID: number = Number(localStorage.getItem("user_id"))
                    return this.menuService.getList(`auth_user_id=${userID}`)
                }
                else {
                    this.menus = data.userMenus
                    return null
                }
            })
            .then((data) => {
                if (data) {
                    this.menuService.setUserMenu(data.results)
                    this.store.select("userStates")
                        .subscribe((data: UserStates): void => {
                            this.menus = data.userMenus
                        })
                }
            })
    }

    toggleSidebar(param: boolean) {
        this.expandSidebar = param
    }
}