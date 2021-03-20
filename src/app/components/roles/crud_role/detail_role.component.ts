import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { 
    FormControl,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Generics } from "src/app/models/generics";

import { UserService } from "src/app/service/user.service";
import { ConfirmUpdateDialog, ErrorPopup } from "../../modal_dialog/modal_confirm.component";

@Component({
    selector: "app-detail-role",
    templateUrl: "./detail_role.component.html",
    styleUrls: [ "./role_styles.component.scss" ]
})

export class DetailRole{
    editMode: boolean = false
    loading: boolean = false

    detailRole: Generics = {}
    formControlData: Generics = {}

    constructor(
        private dialog: MatDialog
    ) {
        this.fetchRequiredData()
    }

    private async fetchRequiredData(): Promise<void> {
        // try {
        //     this.loading = true

        //     await Promise.all([
        //         this.getDetailRole()
        //     ])
        // }
        // catch(err) {
        //     this.errorPopUpGenerator(err)
        // }
        // finally{
        //     this.loading = false
        // }
    }

    private getDetailRole(): Promise<any> {
        return new Promise((resolve, reject) => {
            // this.route.paramMap
            //     .subscribe(async ({ params }: Generics): Promise<void> => {
                    
            //         this.roleService.getUser(params.id)
            //             .subscribe((data: Generics): void => {

            //                 this.detailUser = data
            //                 this.setControlStates(data)
            //                 resolve(true)

            //             }, (error: HttpErrorResponse): void => reject(error))
            //     })
        })
    }

    async update(eventPayload: {[key: string]: FormControl} ): Promise<void> {
        // this.dialog.open(ConfirmUpdateDialog, { data: { confirmed: true } })
        //     .afterClosed()
        //     .subscribe(async (confirmed: boolean) => {

        //         if (confirmed) {
        //             this.performUpdate(eventPayload)
        //         }
        //     })
    }

    private async performUpdate(eventPayload: {[key: string]: FormControl}): Promise<void> {
        // try {
        //     this.loading = true

        //     const payload: Generics = {
        //         username: eventPayload.username.value,
        //         first_name: eventPayload.first_name.value,
        //         last_name: eventPayload.last_name.value,
        //         email: eventPayload.email.value,
        //         mobile: eventPayload.mobile.value,
        //         role_id: eventPayload.role.value,
        //         tenant_id: eventPayload.tenant.value
        //     }
        //     const data = await this.roleService.doUpdate(payload, this.detailUser["id"])

        //     // after send request succeed update forms value
        //     // and current login credential if edited user equals current user
        //     let newFormControlValues: Generics = {}
        //     for (const key in eventPayload) {
        //         newFormControlValues[key] = eventPayload[key].value
        //     }

        //     this.setControlStates(newFormControlValues)
        //     const currentUserID: number = Number(localStorage.getItem("user_id"))
        //     if (data.id === currentUserID) {
        //         this.roleService.setLoggedinUser(data)
        //     }

        //     this.closeForm()    
        // }
        // catch(err) {
        //     this.errorPopUpGenerator(err)
        // }
        // finally{
        //     this.loading = false
        // }
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
    }

    setControlStates(data: Generics): void {
        this.formControlData = {
            is_active: data.is_active ? "active" : "inactive",
            role_name: data.role_name
        }
    }
}