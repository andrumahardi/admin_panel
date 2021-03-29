import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ErrorGenerator } from "src/app/app.helpers";
import { Generics } from "src/app/models/generics";
import { MenuService } from "src/app/service/menu.service";

import { ConfirmUpdateDialog, ErrorPopup } from "../../modal_dialog/modal_confirm.component";

@Component({
    selector: "app-detail-menu",
    templateUrl: "./detail_menu.component.html",
    styleUrls: [ "./menu_styles.component.scss" ]
})

export class DetailMenu{
    formControlData: Generics = {
        menu_name: "",
        menu_path_url: "",
        menu_seq: "",
        parent: "",
        description: ""
    }

    private detailMenu: Generics = {}
    loading: boolean = false
    editMode: boolean = false

    constructor(
        private dialog: MatDialog,
        private menuService: MenuService,
        private route: ActivatedRoute
    ) {
        this.getDetailMenu()
    }

    private getDetailMenu(): void {
        const promise = new Promise<number>((resolve) => {
            this.route.paramMap
                .subscribe(({ params }: Generics) => resolve(params.id))
        })
        promise.then(async (id: number) => {
            const data = await this.menuService.getMenu(id)
            this.detailMenu = data
            this.setControlStates(data)
        })
        .catch((error) => {
            const exception = new ErrorGenerator(error, this.dialog)
            exception.throwError()
        })
    }

    closeForm(): void {
        this.editMode = false
        this.setControlStates(this.detailMenu)
    }

    update(eventPayload: Generics): void {
        const promise = new Promise<boolean>((resolve) => {
            this.dialog.open(ConfirmUpdateDialog, { data: { confirmed: true } })
            .afterClosed()
            .subscribe(async (confirmed: boolean) => {
                if (confirmed) resolve(true)
                else resolve(false)
            })
        })
        promise.then(async (isConfirmed: boolean) => {
            if (isConfirmed) {
                this.loading = true
                
                const payload: FormData = new FormData()
                payload.append("menu_name", eventPayload.data.menu_name.value)
                payload.append("menu_seq", eventPayload.data.menu_seq.value)
                payload.append("menu_path_url", eventPayload.data.menu_path_url.value)
                payload.append("parent_id", eventPayload.data.parent.value)
                payload.append("description", eventPayload.data.description.value)
                payload.append("icon_file", eventPayload.file)
        
                const data = await this.menuService.doUpdate(payload, this.detailMenu.id)
                this.detailMenu = data.body
            }
        })
            .catch((error) => {
                const exception = new ErrorGenerator(error, this.dialog)
                exception.throwError()
            })
            .finally(() => {
                this.closeForm()
                this.loading = false
            })
    }

    setControlStates(data: Generics): void {
        this.formControlData = {
            menu_name: data.menu_name,
            menu_path_url: data.menu_path_url,
            menu_seq: +data.menu_seq,
            parent: data.parent ? String(data.parent) : "",
            description: data.description
        }
    }
}