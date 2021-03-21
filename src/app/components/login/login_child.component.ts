import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ErrorGenerator } from "src/app/app.helpers";
import { PreLoginPayload } from "src/app/models/users";
import { MenuService } from "src/app/service/menu.service";
import { UserService } from "src/app/service/user.service";
import { ErrorPopup } from "../modal_dialog/modal_confirm.component";

@Component({
    selector: "app-login-child",
    templateUrl: "./login_child.component.html",
    styleUrls: [ "./login_child.component.scss" ]
})

export class LoginChildComponent {
    localStates: PreLoginPayload = {
        username: "",
        password: ""
    }
    errorMessage: string = ""

    showErrorDialog: boolean = false
    submitted: boolean = false
    showpassword: boolean = false
    loading: boolean = false

    constructor(
        private userService: UserService,
        private menuService: MenuService,
        private router: Router,
        private dialog: MatDialog
    ) {}

    login(formGroup: NgForm) {
        this.loading = true
        this.submitted = true
        this.showErrorDialog = false
        this.errorMessage = ""

        this.userService.doLogin(formGroup.value)
            .then((res) => {
                this.menuService.setUserMenu(res.menu)
                this.router.navigate(["/home"])
            })
            .catch((error) => {
                const exception = new ErrorGenerator(error, this.dialog)
                exception.throwError()
            })
            .finally(() => this.loading = false)
    }
}