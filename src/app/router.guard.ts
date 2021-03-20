import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable()
export class RouterGuard implements CanActivate{
    constructor(private router: Router) {}

    canActivate(): boolean {
        const token = localStorage.getItem("token")

        if (token) return true

        this.router.navigate(["/auth/login"])
        return false
    }
}