import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ErrorGenerator } from "src/app/app.helpers";
import { Generics } from "src/app/models/generics";

import { UserService } from "src/app/service/user.service";
import { ErrorPopup } from "../../modal_dialog/modal_confirm.component";

@Component({
    selector: "app-detail-user",
    templateUrl: "./create_user.component.html",
    styleUrls: [ "./user_styles.component.scss" ]
})

export class CreateUser{
    formControlData: Generics = {}
    loading: boolean = false

    constructor(
        private userService: UserService,
        private dialog: MatDialog,
        private router: Router
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
            tenant_id: eventPayload.tenant.value,
            password: eventPayload.password.value
        }

        this.loading = true
        this.userService.doRegister(payload)
            .then(() => this.router.navigate(["user"]))
            .catch((error) => {
                const exception = new ErrorGenerator(error, this.dialog)
                exception.throwError()
            })
            .finally(() => this.loading = false)
    }

    setControlStates(): void {
        this.formControlData = {
            first_name: "",
            last_name: "",
            username: "",
            email: "",
            mobile: "",
            tenant: "",
            role: "",
            date_joined: " - ",
            is_confirmed: "Not Confirmed",
            password: ""
        }
    }
}