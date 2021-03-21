import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { 
    FormControl,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { ErrorGenerator, Helpers } from "src/app/app.helpers";
import { Generics } from "src/app/models/generics";

import { UserService } from "src/app/service/user.service";
import { ConfirmUpdateDialog, ActionSuccess, ErrorPopup } from "../../modal_dialog/modal_confirm.component";

@Component({
    selector: "app-detail-user",
    templateUrl: "./detail_user.component.html",
    styleUrls: [ "./user_styles.component.scss" ]
})

export class DetailUser{
    editMode: boolean = false
    loading: boolean = false

    detailUser: Generics = {}
    formControlData: Generics = {}

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private dialog: MatDialog
    ) {
        this.getDetailUser()
    }

    private getDetailUser(): void {
        const promise = new Promise<number>((resolve) => {
            this.route.paramMap
                .subscribe(({ params }: Generics) => resolve(params.id))
        })
        promise.then(async (id: number) => {
            const data = await this.userService.getUser(id)
            this.detailUser = data
            this.setControlStates(data)
        })
        .catch((error) => {
            const exception = new ErrorGenerator(error, this.dialog)
            exception.throwError()
        })
    }

    async update(eventPayload: {[key: string]: FormControl} ): Promise<void> {
        this.dialog.open(ConfirmUpdateDialog, { data: { confirmed: true } })
            .afterClosed()
            .subscribe(async (confirmed: boolean) => {

                if (confirmed) {
                    this.performUpdate(eventPayload)
                }
            })
    }

    private async performUpdate(eventPayload: {[key: string]: FormControl}): Promise<void> {
        this.loading = true

        const payload: Generics = {
            username: eventPayload.username.value,
            first_name: eventPayload.first_name.value,
            last_name: eventPayload.last_name.value,
            email: eventPayload.email.value,
            mobile: eventPayload.mobile.value,
            role_id: eventPayload.role.value,
            tenant_id: eventPayload.tenant.value
        }
        this.userService.doUpdate(payload, this.detailUser["id"])
            .then(() => {
                // after send request succeed update forms value
                // and current login credential if edited user equals current user
                let newFormControlValues: Generics = {}
                for (const key in eventPayload) {
                    newFormControlValues[key] = eventPayload[key].value
                }

                this.setControlStates(newFormControlValues)
                this.closeForm()  
            })
            .catch((error) => {
                const exception = new ErrorGenerator(error, this.dialog)
                exception.throwError()
            })
            .finally(() => this.loading = false)
    }

    confirmUser(): void {
        const email = this.formControlData.email

        if (this.formControlData.role === "") {
            this.dialog.open(ErrorPopup, { data: { message: "Please define a role for this user before sending email containing verification" }})
        }
        else {
            const promise = new Promise<boolean>((resolve) => {
                this.dialog.open(ConfirmUpdateDialog, { data: { confirmed: true } })
                    .afterClosed()
                    .subscribe(async (confirmed: boolean) => {
                        resolve(confirmed)
                    })
            })
            promise.then(async (confirmed: boolean) => {
                    if (confirmed) {
                        this.loading = true
                        
                        await this.userService.doConfirmUser({ email })
                        const message = `Email verification has been sent to ${email}`
                        this.dialog.open(ActionSuccess, { data: { message } })
                    }
                })
                .catch((error) => {
    
            const exception = new ErrorGenerator(error, this.dialog)
            exception.throwError()
                })
                .finally(() => this.loading = false)
        }
    }

    closeForm(): void {
        this.editMode = false
    }

    setControlStates(data: Generics): void {
        this.formControlData = {
            first_name: data.first_name,
            last_name: data.last_name,
            username: data.username,
            email: data.email,
            mobile: data.mobile,
            tenant: data.tenant ? String(data.tenant.id || data.tenant) : "",
            role: data.role ? String(data.role.id || data.role) : "",
            date_joined: Helpers.parseDate(this.detailUser.date_joined),
            is_confirmed: this.detailUser.is_confirmed ? "Confirmed" : "Not Confirmed",
            password: "***********************************"
        }
    }
}