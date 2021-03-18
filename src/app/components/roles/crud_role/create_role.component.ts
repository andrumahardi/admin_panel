import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Generics } from "src/app/models/generics";
import { RoleService } from "src/app/service/role.service";

import { ErrorPopup } from "../../modal_dialog/modal_confirm.component";

@Component({
    selector: "app-create-role",
    templateUrl: "./create_role.component.html",
    styleUrls: [ "./role_styles.component.scss" ]
})

export class CreateRole {
    formControlData: Generics = {}
    loading: boolean = false

    constructor(
        private roleService: RoleService,
        private dialog: MatDialog,
        private router: Router
    ) {
        this.setControlStates()
    }

    closeForm(): void {
        this.setControlStates()
    }

    create(eventPayload: {[key: string]: FormControl}): void {
        console.log(eventPayload)
        const payload: Generics = {
            is_active: eventPayload.is_active.value === "active",
            role_name: eventPayload.role_name.value
        }
        this.performCreate(payload)
    }

    performCreate(payload: Generics): void {
        console.log(payload)
        // try {
        //     this.loading = true

        //     await this.roleService.doRegister(payload)
        //     this.router.navigate(["user"])
        // }
        // catch({ error, status }) {
        //     let message = ""
        //     if (status === 400) {
        //         for (const key in error.detail) {
        //             message = error.detail[key][0]
        //             break
        //         }
        //     }
        //     else message = "Server could not process data"
        //     this.dialog.open(ErrorPopup, { data: { message }})
        // }
        // finally {
        //     this.loading = false
        // }
    }

    setControlStates(): void {
        this.formControlData = {
            is_active: "inactive",
            role_name: ""
        }
    }
}