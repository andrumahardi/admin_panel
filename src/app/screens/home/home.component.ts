import { Component, OnInit } from "@angular/core"
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

export class HomeComponent implements OnInit{
    expandSidebar: boolean = true
    menus: Array<Menu> = []

    constructor(
        private store: Store<AppState>,
        private menuService: MenuService,
    ) {}

    ngOnInit(): void {
        this.store.select("userStates")
            .subscribe(async (data: UserStates): Promise<void> => {
                if (data.userMenus.length === 0) {    
                    const userID: number = Number(localStorage.getItem("user_id"))
                    const data = await this.menuService.getList(`auth_user_id=${userID}`)

                    this.menus = this.menuService.setUserMenu(data.results)
                }
                else {
                    this.menus = data.userMenus
                }
            })
    }

    toggleSidebar(param: boolean) {
        this.expandSidebar = param
    }
}