import { Component, Output, EventEmitter, Input } from "@angular/core"
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/app.states";
import { UserService } from "src/app/service/user.service";
import { User, UserStates } from "src/app/models/users";
import { MatDialog } from "@angular/material/dialog";
import * as UserActions from "src/app/actions/user.actions"
import { Generics } from "src/app/models/generics";
import { ErrorGenerator } from "src/app/app.helpers";

@Component({
    selector: "app-upper-bar",
    templateUrl: "./upperbar.component.html",
    styleUrls: [ "./upperbar.component.scss" ]
})

export class UpperBar{
    user: User | {[key: string]: any} = {}
    profileImage: string = "url(assets/img/user_nopp.svg)"
    showdropdown: boolean = false

    @Input() expandSidebar: boolean = false
    @Output() sidebarEvent = new EventEmitter<boolean>()

    constructor(
        private store: Store<AppState>,
        private userService: UserService,
        private router: Router,
        private dialog: MatDialog
    ) {
        this.fetchData()
    }

    fetchData(): void {
        const promise = new Promise<UserStates>((resolve) => {
            this.store.select("userStates")
                .subscribe((states: UserStates): void => resolve(states))
        })
        promise.then(async (states: UserStates) => {
            if (!states.currentUser.id) {
                const userID: number = Number(localStorage.getItem("user_id"))
                    
                const data: Generics = await this.userService.getUser(userID)
                const user: User = {
                    id: data.id,
                    username: data.username,
                    is_active: data.is_active,
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    mobile: data.mobile,
                    profile_image: data.profile_image
                }
                this.user = user
                this.store.dispatch(UserActions.setUser({ payload: user }))
            }
            else this.user = states.currentUser
            
            if (this.user.profile_image) {
                this.profileImage = `url(${this.user.profile_image})`
            }
        })
        .catch((error) => {
            const exception = new ErrorGenerator(error, this.dialog)
            exception.throwError()
        })
    }

    async logout(): Promise<void> {
        await this.userService.doLogout()
        this.router.navigate(["/auth/login"])
    }

    changePassword(): void {
        this.router.navigate([`auth/${this.user.id}/change_password`])
    }

    toggleSidebar() {
        this.sidebarEvent.emit(!this.expandSidebar)
    }

    userProfile() {
        this.showdropdown = false
        const userID: string | null = localStorage.getItem("user_id")
        this.router.navigate([`profile/${userID}`])
    }
}