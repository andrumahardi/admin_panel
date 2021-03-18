import { Component, Output, EventEmitter, Input, OnInit } from "@angular/core"
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { CookieService } from "ngx-cookie-service";
import { AppState } from "src/app/app.states";
import { UserService } from "src/app/service/user.service";
import { User, UserStates } from "src/app/models/users";

@Component({
    selector: "app-upper-bar",
    templateUrl: "./upperbar.component.html",
    styleUrls: [ "./upperbar.component.scss" ]
})

export class UpperBar implements OnInit {
    user: User | {[key: string]: any} = {}
    pictureUrl: string = ""
    showdropdown: boolean = false

    @Input() expandSidebar: boolean = false
    @Output() sidebarEvent = new EventEmitter<boolean>()

    constructor(
        private store: Store<AppState>,
        private userService: UserService,
        private cookieService: CookieService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.store.select("userStates")
            .subscribe(({ currentUser }: UserStates): void => {
                this.user = currentUser
            })
    }

    logout(): void {
        this.userService.doLogout()
            .then(() => this.router.navigate(["/login"]))
            .finally(() => this.cookieService.deleteAll())
    }

    toggleSidebar() {
        this.sidebarEvent.emit(!this.expandSidebar)
    }
}