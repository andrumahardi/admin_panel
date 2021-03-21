import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ArraysInObject, Generics } from "src/app/models/generics";
import { RoleService } from "src/app/service/role.service";
import * as DropdownListActions from "src/app/actions/dropdown_items.actions";

import { ErrorPopup } from "../../modal_dialog/modal_confirm.component";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/app.states";
import { MenuService } from "src/app/service/menu.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorGenerator } from "src/app/app.helpers";

@Component({
    selector: "app-create-role",
    templateUrl: "./create_role.component.html",
    styleUrls: [ "./role_styles.component.scss" ]
})

export class CreateRole {
    listMenus: Array<Generics> = []
    formControlData: Generics = {}
    loading: boolean = false

    constructor(
        private roleService: RoleService,
        private menuService: MenuService,
        private dialog: MatDialog,
        private router: Router,
        private store: Store<AppState>
    ) {
        this.getMenus()
    }

    closeForm(): void {
        this.setControlStates()
    }

    create(eventPayload: Generics): void {
        this.loading = true
        const payload: Generics = {
            role_name: eventPayload.formControlData.role_name.value,
            menus: eventPayload.selectedMenus
        }

        this.roleService.doCreate(payload)
            .then(() => this.router.navigate(["/role"]))
            .catch((error) => {
                const exception = new ErrorGenerator(error, this.dialog)
                exception.throwError()
            })
            .finally(() => this.loading = false)
    }

    setControlStates(): void {
        this.formControlData = {
            is_active: "active",
            role_name: ""
        }
        this.resetListMenus(this.listMenus)
    }

    private getMenus(): void {
        const promise = new Promise<ArraysInObject>((resolve, reject) => {
            this.store.select("dropdownItems")
                .subscribe((data: ArraysInObject) => resolve(data))
        })
        promise.then(async (data: ArraysInObject) => {
            if (!data.menuList[0]) {

                const menus: Array<Generics> = await this.menuService.getAll()
                const nestedMenus = this.menuService.organizeMenu(menus)
                this.store.dispatch(DropdownListActions.setMenuList({ payload: menus }))

                this.listMenus = nestedMenus
            }
            else this.listMenus = this.menuService.organizeMenu(data.menuList)
            this.setControlStates()

        }).catch((error) => {
            const exception = new ErrorGenerator(error, this.dialog)
            exception.throwError()
        })
    }
    
    resetListMenus(data: Array<Generics>): void {
        this.listMenus = data.map((menu: Generics) => {
            return {
                ...menu,
                selected: false,
                children: menu.children.map((child: Generics) => {
                    return {
                        ...child,
                        selected: false
                    }
                })
            }
        })
    }
}