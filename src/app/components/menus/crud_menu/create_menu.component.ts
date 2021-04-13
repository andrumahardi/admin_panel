import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ErrorGenerator } from "src/app/app.helpers";
import { Generics } from "src/app/models/generics";
import { MenuService } from "src/app/service/menu.service";

import { ErrorPopup } from "../../modal_dialog/modal_confirm.component";

@Component({
    selector: "app-create-menu",
    templateUrl: "./create_menu.component.html",
    styleUrls: [ "./menu_styles.component.scss" ]
})

export class CreateMenu{
    formControlData: Generics = {
        menu_name: "",
        menu_path_url: "",
        menu_seq: "",
        parent: "",
        description: ""
    }

    loading: boolean = false

    constructor(
        private dialog: MatDialog,
        private menuService: MenuService,
        private router: Router
    ) {
        this.setControlStates()
    }

    closeForm(): void {
        this.setControlStates()
    }

    create(eventPayload: Generics): void {
        const payload: FormData = new FormData()
        payload.append("menu_name", eventPayload.data.menu_name.value)
        payload.append("menu_seq", eventPayload.data.menu_seq.value)
        payload.append("menu_path_url", eventPayload.data.menu_path_url.value)
        payload.append("parent_id", eventPayload.data.parent.value)
        payload.append("description", eventPayload.data.description.value)
        payload.append("icon_image", eventPayload.file)

        this.loading = true
        this.menuService.doCreate(payload)
            .then(() => {
                this.closeForm()
                this.router.navigate(["/menu"])
            })
            .catch((error) => {
                const exception = new ErrorGenerator(error, this.dialog)
                exception.throwError()
            })
            .finally(() => {
                this.loading = false
            })
    }

    setControlStates(): void {
        this.formControlData = {
            menu_name: "",
            menu_path_url: "",
            menu_seq: "",
            parent: "",
            description: "",
            menu_icon_url: ""
        }
    }
}