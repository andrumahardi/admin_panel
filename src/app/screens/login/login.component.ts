import { Component, OnInit } from "@angular/core"
import { NgForm } from "@angular/forms"

import { UserService } from "../../service/user.service"
import { CookieService } from "ngx-cookie-service"
import { Router } from "@angular/router"
import { MatDialog } from "@angular/material/dialog"
import { HttpErrorResponse } from "@angular/common/http"
import { ErrorPopup } from "src/app/components/modal_dialog/modal_confirm.component"
import { MenuService } from "src/app/service/menu.service"

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: [ "./login.component.scss" ]
})

export class LoginComponent implements OnInit {
    public currentYear: number = new Date().getFullYear()
    username: string = ""
    password: string = ""

    showpassword: boolean = false
    loading: boolean = false
    
    errorMessage: string = ""
    showErrorDialog: boolean = false
    submitted: boolean = false

    constructor(
        private userService: UserService,
        private cookieService: CookieService,
        private router: Router,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        const token = this.cookieService.get("token")
        if (token) this.router.navigate(["/"])
    }

    login(formGroup: NgForm) {
        this.loading = true
        this.submitted = true
        this.showErrorDialog = false
        this.errorMessage = ""

        this.userService.doLogin(formGroup.value)
            .then((res) => {
                this.userService.setUserMenu(res.menu)
                this.router.navigate(["/"])
            })
            .catch((err) => this.errorPopUpGenerator(err))
            .finally(() => {
                formGroup.resetForm()

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
}