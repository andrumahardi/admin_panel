import { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { CookieService } from "ngx-cookie-service"
import { Observable } from "rxjs"
import { Generics, PaginatedListResult } from "../models/generics"
import { ConfigService } from "./config.service"

@Injectable({
    providedIn: "root"
})
export class MenuService {
    constructor(
        private http: HttpClient, 
        private configService: ConfigService,
        private cookieService: CookieService,
    ) {}

    private readonly baseEndpoint: string = `${this.configService.getUrl("menus")}/`
    private accessToken: string = this.cookieService.get("token")

    getList(params: string = ""): Promise<PaginatedListResult> {
        if (params) params = `?${params}`
        const url = `${this.baseEndpoint}${params}`

        return new Promise<PaginatedListResult>((resolve, reject) => {
            this.http.get(url, { observe: "response", headers: { 
                authorization: `Token ${this.accessToken}`
            }})
                .subscribe((data: Generics): void => {
                    const { body } = data
                    resolve(body)
                }, (error: HttpErrorResponse): void => reject(error))
        })
    }
}