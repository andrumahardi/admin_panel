import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Store } from "@ngrx/store"
import { CookieService } from "ngx-cookie-service"
import { AppState } from "../app.states"
import { Generics } from "../models/generics"

@Injectable({
    providedIn: "root"
})
export class ConfigService {
    private readonly baseUrl: string | undefined = process.env.LOCAL_SERVER_BASE_URL
    private readonly endpoints: Generics = {
        users: "users",
        menus: "menus",
        tenants: "tenants",
        roles: "roles"
    }

    constructor(
        protected http: HttpClient,
        protected cookieService: CookieService,
        protected store: Store<AppState>
    ) {}
    
    getUrl(endpoint: string): string {
        return `${this.baseUrl}/${this.endpoints[endpoint]}`
    }

    getAccessToken(): string {
        return this.cookieService.get("token")
    }
}
