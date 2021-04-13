import { Component, Output, EventEmitter, Input, OnInit } from "@angular/core"
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/app.states";
import { UserService } from "src/app/service/user.service";
import { User, UserStates } from "src/app/models/users";
import { MatDialog } from "@angular/material/dialog";
import { Generics } from "src/app/models/generics";
import { ErrorGenerator } from "src/app/app.helpers";

@Component({
    selector: "app-upper-bar",
    templateUrl: "./upperbar.component.html",
    styleUrls: [ "./upperbar.component.scss" ]
})

export class UpperBar implements OnInit{
    user: User | Generics = {}
    profileImage: string = "url(assets/img/user_nopp.svg)"
    showdropdown: boolean = false

    @Input() expandSidebar: boolean = false
    @Output() sidebarEvent = new EventEmitter<boolean>()

    constructor(
        private store: Store<AppState>,
        private userService: UserService,
        private router: Router,
        private dialog: MatDialog
    ) {}
    
    ngOnInit(): void {
        this.store.select("userStates")
            .subscribe(async (states: UserStates): Promise<void> => {
                if (!states.currentUser.id) {
                    const userID: number = Number(localStorage.getItem("user_id"))
                        
                    const data: Generics = await this.userService.getUser(userID)
                    const user: User = this.userService.setLoggedinUser(data)
                    this.user = user
                }
                else this.user = states.currentUser
                
                if (this.user.profile_image) {
                    this.profileImage = `url(${this.user.profile_image})`
                }
            }, (error) => {
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