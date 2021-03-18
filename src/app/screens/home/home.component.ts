import { Component } from "@angular/core"
import { Store } from "@ngrx/store"
import { CookieService } from "ngx-cookie-service"
import { AppState } from "src/app/app.states"
import { Generics, PaginatedListResult } from "src/app/models/generics"
import { Menu } from "src/app/models/menus"
import { UserStates } from "src/app/models/users"

import { MenuService } from "src/app/service/menu.service"
import { TenantService } from "src/app/service/tenant.service"
import { UserService } from "src/app/service/user.service"

import * as UserActions from "src/app/actions/user.actions"
import * as DropdownListActions from "src/app/actions/dropdown_items.actions"

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
        private cookieService: CookieService,
        private menuService: MenuService,
        private tenantService: TenantService,
        private userService: UserService
    ) {
        this.fetchInitialData()
    }

    fetchInitialData(): void {
        Promise.all([
            this.getListTenants(),
            this.getCurrentUser(),
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
                    const userID = this.cookieService.get("user_id")
                    return this.menuService.getList(`auth_user_id=${userID}`)
                }
                else {
                    this.menus = data.userMenus
                    return null
                }
            })
            .then((data) => {
                if (data) {
                    this.userService.setUserMenu(data.results)
                    this.store.select("userStates")
                        .subscribe((data: UserStates): void => {
                            this.menus = data.userMenus
                        })
                }
            })
    }

    private getCurrentUser(): Promise<boolean> {
        return new Promise((resolve, _) => {
            const userID = +this.cookieService.get("user_id")
                        
            this.userService.getUser(userID)
                .subscribe((data: Generics): void => {
                    this.store
                        .dispatch(UserActions.setUser(
                            { 
                                payload: {
                                    id: data.id,
                                    username: data.username,
                                    is_active: data.is_active,
                                    email: data.email,
                                    first_name: data.first_name,
                                    last_name: data.last_name,
                                    mobile: data.mobile
                                } 
                            }
                        ))
                    resolve(true)
                })
        })
    }

    private getListTenants(): Promise<boolean> {
        return new Promise((resolve, _) => {
            this.tenantService.getList(`purpose=dropdown`)
                .subscribe((data: PaginatedListResult): void => {
                    this.store
                        .dispatch(
                            DropdownListActions.setTenantList({ payload: data.results }
                        ))
                    resolve(true)
                })
        })
    }

    toggleSidebar(param: boolean) {
        this.expandSidebar = param
    }
}