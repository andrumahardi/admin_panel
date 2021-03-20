import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Generics } from "src/app/models/generics";

import { ErrorPopup } from "../../modal_dialog/modal_confirm.component";

@Component({
    selector: "app-detail-user",
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

    constructor(
        private dialog: MatDialog,
    ) {
        this.setControlStates()
    }

    closeForm(): void {
        this.setControlStates()
    }

    create(eventPayload: {[key: string]: FormControl}): void {
        const payload: Generics = {
            username: eventPayload.username.value,
            first_name: eventPayload.first_name.value,
            last_name: eventPayload.last_name.value,
            email: eventPayload.email.value,
            mobile: eventPayload.mobile.value,
            role_id: eventPayload.role.value,
            tenant_id: eventPayload.tenant.value,
            password: eventPayload.password.value
        }
        this.performCreate(payload)
    }

    async performCreate(payload: Generics): Promise<void> {
        try {
            // await this.menuService.doRegister(payload)
            // this.router.navigate(["user"])
        }
        catch({ error, status }) {
            let message = ""
            if (status === 400) {
                for (const key in error.detail) {
                    message = error.detail[key][0]
                    break
                }
            }
            else message = "Server could not process data"
            this.dialog.open(ErrorPopup, { data: { message }})
        }
    }

    setControlStates(): void {
        this.formControlData = {
            menu_name: "",
            menu_path_url: "",
            menu_seq: "",
            parent: "",
            description: ""
        }
    }
}