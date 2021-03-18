import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class RouterGuard implements CanActivate{
    constructor(
        private cookieService: CookieService,
        private router: Router
    ) {}

    canActivate(): boolean {
        const token = this.cookieService.get("token")

        if (token) return true

        this.router.navigate(["/login"])
        return false
    }
}