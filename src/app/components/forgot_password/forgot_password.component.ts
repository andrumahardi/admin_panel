import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Generics } from "src/app/models/generics";
import { UserService } from "src/app/service/user.service";
import { ActionSuccess, ErrorPopup } from "../modal_dialog/modal_confirm.component";

@Component({
    selector: "app-forgot-password",
    templateUrl: "./forgot_password.component.html",
    styleUrls: [ "./forgot_password.component.scss" ]
})

export class ForgotPassword{
    loading = false

    constructor(
        private userService: UserService,
        private dialog: MatDialog
    ) {}

    readonly errorMessages = {
        required: "This field is required!",
        email: "Please enter valid email",
        maxlength: "Character is too long",
        maxPhoneNum: "Phone number is too long",
        mobilePatternInvalid: "Phone number invalid",
        minlength: "Characters too short",
        minPhoneNum: "Phone number is too short"
    }

    readonly formControl: {[key: string]: FormControl} = {
        email: new FormControl("", [
            Validators.required,
            Validators.minLength(5),
            Validators.email
        ]),
        mobile: new FormControl("", [
            Validators.required,
            Validators.maxLength(12),
            Validators.minLength(10),
            CustomValidator.mobilepattern()
        ]),
    }

    forgotPassword(): void {
        const formValid: boolean = Object.values(this.formControl)
            .every((control) => !control.errors)
        
        if (formValid) {
            this.loading = true
            
            const params: string = [
                `email=${this.formControl.email.value}`,
                `phone=${this.formControl.mobile.value}`
            ].join("&")

            this.userService.doResetPassword(params)
                .then(() => {
                    const message = `Email verification has been sent to ${this.formControl.email.value}`
                    this.dialog.open(ActionSuccess, { data: { message }})
                    this.resetFormControl()
                })
                .catch((error) => this.errorPopUpGenerator(error))
                .finally(() => this.loading = false)
        }
    }

    resetFormControl() {
        for (const key in this.formControl) {
            this.formControl[key].reset()
        }
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
}

class CustomValidator extends Validators{
    static mobilepattern(): ValidatorFn {
        return CustomValidator.generateMobilePatternError
    }

    static generateMobilePatternError(control: AbstractControl): ValidationErrors | null {
        const pattern = /[^0-9]/ig
        const mobilephoneValid: boolean = (control.value.search(pattern) === -1)

        if (mobilephoneValid) return null
        return {mobilepattern: true}
    }
}