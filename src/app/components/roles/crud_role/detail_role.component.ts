import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { 
    FormControl,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import { AppState } from "src/app/app.states";
import { ArrayOfObjects, Generics } from "src/app/models/generics";
import { MenuService } from "src/app/service/menu.service";
import { ConfirmUpdateDialog, ErrorPopup } from "../../modal_dialog/modal_confirm.component";
import * as DropdownListActions from "src/app/actions/dropdown_items.actions";
import { ActivatedRoute } from "@angular/router";
import { RoleService } from "src/app/service/role.service";

@Component({
    selector: "app-detail-role",
    templateUrl: "./detail_role.component.html",
    styleUrls: [ "./role_styles.component.scss" ]
})

export class DetailRole{
    detailRole: Generics = {}
    formControlData: Generics = {}
    listMenus: Array<Generics> = []
    
    editMode: boolean = false
    loading: boolean = false

    constructor(
        private dialog: MatDialog,
        private store: Store<AppState>,
        private menuService: MenuService,
        private roleService: RoleService,
        private route: ActivatedRoute
    ) {
        this.getMenus()
        this.getDetailRole()
    }

    private getMenus(): void {
        const promise = new Promise<ArrayOfObjects>((resolve) => {
            this.store.select("dropdownItems")
                .subscribe((data: ArrayOfObjects) => resolve(data))
        })
        promise.then(async (data: ArrayOfObjects) => {
            if (!data.menuList[0]) {
                const menus: Array<Generics> = await this.menuService.getAll()

                this.listMenus = menus.map(menu => {
                    return {
                        ...menu,
                        selected: false,
                        children: menu["children"].map((child: Generics) => {
                            return {
                                ...child,
                                selected: false
                            }
                        })
                    }
                })
                this.store.dispatch(DropdownListActions.setMenuList({ payload: this.listMenus }))
            }
            else this.listMenus = data.menuList
        }).catch((error) => this.errorPopUpGenerator(error))
    }

    private getDetailRole(): void {
        const promise = new Promise<number>((resolve) => {
            this.route.paramMap.subscribe(({ params }: Generics) => {
                resolve(params.id)
            })
        })
        promise.then((id: number) => {
            this.roleService.getRole(id)
            .then((data: Generics): void => {
                this.detailRole = data
                this.setControlStates(data)
            })
            .catch((error: HttpErrorResponse) => this.errorPopUpGenerator(error)) 
        })
    }

    async update(eventPayload: Generics): Promise<void> {
        this.loading = true
        const roleName: string = eventPayload.formControlData.role_name.value
        const isActive: boolean = eventPayload.formControlData.is_active.value === "active"
        
        const payload: Generics = {
            role_name: roleName,
            is_active: isActive,
            menus: eventPayload.selectedMenus
        }

        const promise = new Promise<boolean>((resolve) => {
            this.dialog.open(ConfirmUpdateDialog, { data: { confirmed: true } })
                .afterClosed()
                .subscribe(async (confirmed: boolean) => {
                    
                    if (confirmed) resolve(true)
                    else resolve(false)

                })
        })
        promise.then(async (response: boolean) => {
            if (response) {
                await this.roleService.doUpdate(payload, this.detailRole.id)
                
                this.formControlData = {
                    role_name: roleName,
                    is_active: isActive ? "active" : "inactive"
                }
            } 
        })
            .catch((error) => this.errorPopUpGenerator(error))
            .finally(() => {
                this.editMode = false
                this.loading = false
            })
    }

    errorPopUpGenerator({ error, status }: HttpErrorResponse): void {
        let message: string = ""
        switch (status) {
            case 400:
                for (const key in error.detail) {
                    message = error.detail[key][0]
                    break
                }
                break
            case 500:
                message = "Server could not process data"
                break
            default:
                message = error.detail
        }
        this.dialog.open(ErrorPopup, { data: { message }})
    }

    closeForm(): void {
        this.editMode = false
        this.setControlStates(this.detailRole)
    }

    setControlStates(data: Generics): void {
        this.formControlData = {
            is_active: data.is_active ? "active" : "inactive",
            role_name: data.role_name
        }

        this.listMenus = this.listMenus.map((menu: Generics) => {
            let parentMenu = menu
            if (data.menus.includes(menu.id)){
                parentMenu = {
                    ...menu,
                    selected: true,
                    children: menu.children.map((child: Generics) => {
                        let childMenu = child
                        if (data.menus.includes(child.id)) {
                            childMenu = {
                                ...child,
                                selected: true
                            }
                        }
                        return childMenu
                    })
                }
            }
            return parentMenu
        })
    }
}