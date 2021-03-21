import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ErrorGenerator } from "src/app/app.helpers";
import { Generics } from "src/app/models/generics";
import { UserService } from "src/app/service/user.service";
import { ActionSuccess, ErrorPopup } from "../modal_dialog/modal_confirm.component";

@Component({
    selector: "app-change-password",
    templateUrl: "./change_password.component.html",
    styleUrls: [ "./change_password.component.scss" ]
})

export class ChangePassword{
    readonly errorMessages = {
        required: "This field is required!",
        maxlength: "Character is too long",
        minlength: "Characters too short"
    }

    loading: boolean = false
    showPassword: boolean = false

    confirm_password: string = ""

    constructor(
        private dialog: MatDialog,
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    readonly formControl: {[key: string]: FormControl} = {
        prev_password: new FormControl("", [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(20)
        ]),
        new_password: new FormControl("", [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(20)
        ])
    }

    changePassword(): void {
        const formValid: boolean = Object.values(this.formControl)
            .every((control) => !control.errors)
        
        const newPasswordHasBeenChecked = (this.confirm_password === this.formControl.new_password.value)
        if (formValid && newPasswordHasBeenChecked) {
            this.loading = true
            
            const payload = {
                old_password: this.formControl.prev_password.value,
                new_password: this.formControl.new_password.value
            }
            
            const promise = new Promise<number>((resolve) => {
                this.route.paramMap
                    .subscribe(({ params }: Generics) => resolve(params.id))
            })
            promise.then((id: number) => {
                return this.userService.doChangePassword(payload, id)
            })
                .then(() => {
                    localStorage.removeItem("token")
                    localStorage.removeItem("user_id")

                    this.router.navigate(["/auth/login"])
                    this.resetFormControl()
                })
                .catch((error) => {
                    const exception = new ErrorGenerator(error, this.dialog)
                    exception.throwError()
                })
                .finally(() => this.loading = false)
        }
        else {
            this.dialog.open(ErrorPopup, { data: { message: "New Password is not match with confirmation password" }})
        }
    }

    resetFormControl() {
        for (const key in this.formControl) {
            this.formControl[key].reset()
        }
    }
}